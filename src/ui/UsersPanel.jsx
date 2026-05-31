import "@material/web/button/filled-button.js";
import "@material/web/button/elevated-button";
import "@material/web/fab/fab";
import "@material/web/fab/branded-fab";
import "@material/web/iconbutton/icon-button";
import "@material/web/textfield/outlined-text-field"
import "@material/web/iconbutton/filled-icon-button";
import "@material/web/icon/icon"
import "@material/web/button/filled-tonal-button"
import "@material/web/button/filled-button"
import "@material/web/button/text-button"
import "@material/web/chips/suggestion-chip"

import { For, Show } from "solid-js";
import { useAppState, usePlaylistState, useRemoteState, useRemotePlaylistState, useCurrentVideo } from "../App";
import { createSignal } from "solid-js";

export default () => {
    const [remoteStates, setRemoteStates] = useRemoteState()
    const [playbackState, setPlaybackState] = useAppState()


    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const mm = String(mins).padStart(2, '0');
        const ss = String(secs).padStart(2, '0');
        const hr = String(hrs).padStart(2, '0');
        return hrs === 0 ? `${mm}:${ss}` : `${hr}:${mm}:${ss}`;
    }

    const buildState = (item, self, difference) => {

        console.log("Difference: ", )
        var content = (
            <div class={`p-1 py-5 ${ item.progress > 3600 ? "text-[10px]" : "text-xs" }`}>
                {formatTime(item.progress)}

                <Show when={difference != undefined}>
                    <div>
                        {difference.toPrecision(2)}
                    </div>
                </Show>
            </div>
        );

        content = self ? (
            <md-filled-button class="w-full">
                {content}
            </md-filled-button>
        ) : (
            <md-filled-tonal-button class="w-full">
                {content}
            </md-filled-tonal-button>
        )

        return (
            <div class="py-1">
                {
                    content
                }
            </div>
        )
    }

    return (
        <div class="flex-col flex">

            {
                buildState(playbackState(), true)
            }

            <For each={remoteStates().entries().toArray()}>
                {

                    (id, index) => {
                    
                        let diff =  id[1].progress - playbackState().progress;
                        return buildState(id[1], false)
                    }
                }
            </For>
        </div>

    );
}