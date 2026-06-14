
import { createSignal, createEffect, onMount, Show } from 'solid-js';

import { default as YoutubeIframeAPI, PlayerState as YoutubePlayerState } from './player/youtube/YoutubeIframeApi';
import { YoutubeVideoController } from './player/VideoController';
import "@material/web/button/filled-button.js";

import { useAppState, useCurrentVideo, useRemoteState } from '../App';
import MemberState, { PlaybackStates } from '../state/PlaybackState';
export default (props) => {
    let youtubeIfrme;
    let controller = null;

    const [playbackInfo, setPlaybackInfo] = createSignal(null);
    const [playbackState, setPlaybackState] = useAppState()
    const [remoteUserStates, setRemoteUserStates] = useRemoteState()
    const [currentVideo, setCurrentVideo] = useCurrentVideo()

    const approxEqual = (a, b) => {
        let diff = Math.abs(a - b);
        console.log("Difference: ", diff);
        return diff < 0.3
    }

    const debugView = false;

    var seekTo = null;

    const onReceivedData = (data) => {
        var msg = JSON.parse(data.data);

        if (msg.type == "state_update") {
            let prevMap = remoteUserStates();

            let map = new Map(prevMap);

            map.set(data.rtcBackendIdentity, msg.state);

            if(playbackState().videoId == null) {
                let state = structuredClone(playbackState());
                state.videoId = msg.state.videoId;
                setPlaybackState(state);
                setCurrentVideo(msg.state.videoId)
                seekTo = msg.state.progress;
            }

            setRemoteUserStates(map);
        }

        if (msg.type == "command") {
            let currentState = playbackState();
            console.log("Received command: ", data);
            var state = msg.state;

            if (msg.command == "pause") {

                controller.remoteUserSeek(state.progress);

                controller.remoteUserPause();
                setPauseState();
            }

            if (msg.command == "play") {
                if (!approxEqual(state.progress, currentState.progress)) {
                    console.log("Not at correct time, seeking before playing");
                    controller.remoteUserSeek(state.progress);
                }

                controller.remoteUserPlay();
                setPlayingState();
            }

            if (msg.command == "openvideo") {
                console.log("Received open video command");
                console.log(msg);

                let state = structuredClone(playbackState());
                state.videoId = msg.state;
                setPlaybackState(state);
                setCurrentVideo(msg.state)
            }
        }
    }

    onMount(() => {
        window.RTC.data$.subscribe(onReceivedData);
    });

    createEffect(() => {
        if (window.RTC != undefined) {
            window.RTC.sendData({
                type: "state_update",
                state: playbackState(),
            })
        }
    });

    const onUserPause = () => {
        setPauseState();

        window.RTC.sendData({
            type: "command",
            command: "pause",
            state: playbackState(),
        })
    }

    const setPlayingState = () => {
        let state = structuredClone(playbackState());
        state.targetState = PlaybackStates.PLAYING;
        setPlaybackState(state);
    }

    const setPauseState = () => {
        let state = structuredClone(playbackState());
        state.targetState = PlaybackStates.PAUSED;
        setPlaybackState(state);
    }

    const onUserPlay = () => {
        setPlayingState();
        console.log("Seinding play command");

        window.RTC.sendData({
            type: "command",
            command: "play",
            state: playbackState(),
        })

    }

    const onStateChange = (ev) => {
        let state = structuredClone(playbackState());

        state.currentState = ev.state

        setPlaybackState(state);
    }

    const onTimechanged = (ev) => {
        let state = structuredClone(playbackState());

        state.progress = ev.currentTime;

        setPlaybackState(state);
    }

    const onLoad = () => {
        console.log(youtubeIfrme)
        console.log("Iframe loaded!");
        let api = new YoutubeIframeAPI(youtubeIfrme)

        controller = new YoutubeVideoController(api);
        controller.addEventListener("userpause", onUserPause);
        controller.addEventListener("userplay", onUserPlay);
        controller.addEventListener("statechange", onStateChange);
        controller.addEventListener("timechanged", onTimechanged);
        
        if(seekTo != null) {
            controller.remoteUserSeek(seekTo);
            controller.remoteUserPlay();
            seekTo = null;
        }
        console.log("Seeking to: ", seekTo);
    }

    const doRemotePause = () => {
        controller.remoteUserPause();
    }

    const doRemotePlay = () => {
        controller.remoteUserPlay();
    }

    const idToIframeUrl = () => {
        let id = currentVideo();

        let url = new URL(id)

        console.log(url)
        console.log(url.hostname);

        if (url.protocol == "youtube:") {
            //  ""
            let id = url.host;

            return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&showinfo=0&controls=1&enablejsapi=1&iv_load_policy=3&rel=0&showinfo=0&modestbranding=1`
        }
    }

    return (
        <div style={{ width: "100%", height: "100%" }} class="relative">
            <Show when={currentVideo() != ""}>
                <iframe ref={youtubeIfrme} onLoad={onLoad} style={{ width: "100%", height: "100%" }} src={idToIframeUrl()} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </Show>
            <Show when={props.debugMode == true}>

            <div class="backdrop-blur-2xl z-10  bg-white/20 rounded-2xl text-xs absolute top-0" style={{
                "padding-top": "var(--safe-area-top)",
            }}>
                {
                    <pre>
                        Playback info:
                        {
                            JSON.stringify(playbackState(), null, "  ")
                        }

                        <br></br>
                        Remote User Info:
                        {
                            JSON.stringify(Object.fromEntries(remoteUserStates().entries()), null, "  ")
                        }
                    </pre>
                }
            </div> 
                </Show>
        </div>
    )
};
