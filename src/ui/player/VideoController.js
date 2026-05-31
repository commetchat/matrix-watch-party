import MemberState, { PlaybackStates } from '../../state/PlaybackState';
import {default as YoutubeIframeAPI, PlayerState as YoutubePlayerState} from './youtube/YoutubeIframeApi'


export class VideoController {
    remoteUserPause(){

    }

    remoteUserPlay() {

    }

    remoteUserSeek() {

    }

    addEventListener(type, callback) {

    }

    removeEventListener(type, callback) {

    }
}

export class YoutubeVideoController extends VideoController {
    constructor(api) {
        super();
        this.playerState = YoutubePlayerState.UNSTARTED;

        this._events = new EventTarget();

        this.api = api;
        this.ignoreEventsQueue = new Array();
        api.onInfoDelivery = this.onInfoDelivery.bind(this)
    }

    remoteUserPause() {
        if(!(this.playerState == YoutubePlayerState.PLAYING || this.playerState == YoutubePlayerState.BUFFERING)) {
            console.log("Cannot pause from current state, ignoring");
            return;
        }

        this.api.pause();
    
        // ignore next state update informing us the video was paused
        this.ignoreEventsQueue.push((ev) => ev['info']['playerState'] == YoutubePlayerState.PAUSED);
    }


    remoteUserPlay() {
        if(this.playerState == YoutubePlayerState.PLAYING || this.playerState == YoutubePlayerState.BUFFERING) {
            console.log("Cannot play from current state, ignoring");
            return;
        }

        this.api.play();

        // ignore next state update informing us the video was played
        this.ignoreEventsQueue.push((ev) => ev['info']['playerState'] == YoutubePlayerState.PLAYING);
    }

    addEventListener(type, callback) {
        this._events.addEventListener(type, callback);
    }

    removeEventListener(type, callback) {
        this._events.removeEventListener(type, callback);
    }

    remoteUserSeek(seekTo) {
        this.api.seek(seekTo, true);
    }

    youtubeStateToPlayerState(state) {
        if(state == YoutubePlayerState.BUFFERING) {
            return PlaybackStates.BUFFERING;
        }

        if(state == YoutubePlayerState.PLAYING) {
            return PlaybackStates.PLAYING;
        }

        if(state == YoutubePlayerState.PAUSED) {
            return PlaybackStates.PAUSED;
        }

        if(state == YoutubePlayerState.ENDED) {
            return PlaybackStates.ENDED;
        }

        if(state == YoutubePlayerState.UNSTARTED) {
            return PlaybackStates.UNSTARTED;
        }

        if(state == YoutubePlayerState.CUED) {
            return PlaybackStates.UNSTARTED;
        }
    }

    onInfoDelivery(ev) {
        let info = ev['info'];
        if(info == undefined) return;

        if(info['playerState'] != undefined) {
            this.playerState = info['playerState']

            var state = this.youtubeStateToPlayerState(this.playerState);
            var stateEvent = new Event("statechange");
            stateEvent.state = state;

            this._events.dispatchEvent(stateEvent);

            if(!this.ignoreEvent(ev)) {
                console.log("Player state changed unexpectedly, something changed locally")

                if(this.playerState == YoutubePlayerState.PLAYING) {
                    console.log("Local user pressed play");
                    var ev = new Event("userplay", {});
                    this._events.dispatchEvent(ev);
                }

                if(this.playerState == YoutubePlayerState.PAUSED) {
                    console.log("Local user pressed pause");
                    var ev = new Event("userpause", {});
                    this._events.dispatchEvent(ev);
                }
            }
        }

        if(info['currentTime'] != undefined) {
            var timeEvent = new Event("timechanged");
            timeEvent.currentTime = info['currentTime'];

            this._events.dispatchEvent(timeEvent);
        }
    }

    ignoreEvent(ev) {
        for(var i = 0; i < this.ignoreEventsQueue.length; i++) {
            let callback = this.ignoreEventsQueue[i];

            if(callback(ev) == true) {
                console.log("Ignoring event: ",ev);
                console.log("Because it matched callback: ", callback)
                this.ignoreEventsQueue.splice(i, 1)
                return true;
            }
        }

        return false;
    }
}