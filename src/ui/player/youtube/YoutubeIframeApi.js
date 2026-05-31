
export const PlayerState = Object.freeze({
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
});

export const EventType = Object.freeze({
    COMMAND: "command",
    LISTENING: "listening",
    INITIAL_DELIVERY: "initialDelivery",
    ON_READY: "onReady",
    INFO_DELIVERY: "infoDelivery",
    API_INFO_DELIVERY: "apiInfoDelivery",
});

export const Functions = Object.freeze({
    INVALID: "invalid",
    PLAY: "playVideo",
    PAUSE: "pauseVideo",
    STOP: "stopVideo",
    CLEAR: "clearVideo",
    MUTE: "mute",
    UNMUTE: "unMute",
    SEEK: "seekTo",
    NEXT: "nextVideo",
    PREVIOUS: "previousVideo",
    PLAY_AT: "playVideoAt",
    LOAD_BY_ID: "loadVideoById",
    QUEUE_BY_ID: "cueVideoById",
    LOAD_BY_URL: "loadVideoByUrl",
    QUEUE_BY_URL: "cueVideoByUrl",
    LOAD_PLAYLIST: "loadPlaylist",
    QUEUE_PLAYLIST: "cuePlaylist",
    SET_VOLUME: "setVolume",
    SET_PLAYBACK_RATE: "setPlaybackRate",
    SET_PLAYBACK_QUALITY: "setPlaybackQuality",
    SET_LOOP_PLAYLIST: "setLoop",
    SET_SHUFFLE_PLAYLIST: "setShuffle",
    SET_OPTION: "setOption",
});

export default class YoutubeIframeAPI {
    constructor(iframe) {
        this.iframe = iframe;
        this.videoData = undefined;

        this.onInfoDelivery = undefined;
        this.onInitialInfoDelivery = undefined;
        this.onAPIInfoDelivery = undefined;

        console.log(iframe.src);
        this._onLoad();

        window.addEventListener('message', (e) => {
            const cb = this._onMessageReceived.bind(this);
            cb(e);
        });
    }

    _onLoad() {
        this._sendMessage({
            event: "listening",
            id: 0
        });
    }

    _onListeningInterval() {
        const event = {
            event: EventType.LISTENING,
            id: 0,
        };

        this._sendMessage(event);
    }

    _onMessageReceived(message) {
        if (message.source !== this.iframe.contentWindow) return;

        const msg = JSON.parse(message.data);
        this._handleMessage(msg);
    }

    _handleMessage(message) {
        const msg = message;

        switch (msg.event) {
            case EventType.INITIAL_DELIVERY:
                this._onInitialDelivery(msg);
                break;

            case EventType.ON_READY:
                console.log("READY");
                break;

            case EventType.INFO_DELIVERY:
                this._onInfoDelivery(msg);
                break;

            case EventType.API_INFO_DELIVERY:
                this._onAPIInfoDelivery(msg);
                break;

            default:
                console.log("Received Unknown Message");
                console.log(JSON.stringify(msg));
        }
    }

    _onInitialDelivery(message) {
        if (this.onInitialInfoDelivery) {
            this.onInitialInfoDelivery(message);
        }
    }

    _onInfoDelivery(message) {
        if (this.onInfoDelivery) {
            this.onInfoDelivery(message);
        }
    }

    _onAPIInfoDelivery(message) {
        if (this.onAPIInfoDelivery) {
            this.onAPIInfoDelivery(message);
        }
    }

    _sendMessage(message) {
        this.iframe.contentWindow?.postMessage(
            JSON.stringify(message),
            "*" // todo: fix this
        );
    }

    play() {
        const message = {
            event: EventType.COMMAND,
            func: Functions.PLAY,
            id: 0,
            args: []
        };

        this._sendMessage(message);
    }

    pause() {
        const message = {
            event: EventType.COMMAND,
            func: Functions.PAUSE,
            id: 0,
            args: []
        };

        this._sendMessage(message);
    }

    seek(seekTo, seekAhead) {
        const message = {
            event: EventType.COMMAND,
            func: Functions.SEEK,
            id: 0,
            args: [seekTo, seekAhead]
        };

        this._sendMessage(message);
    }
}