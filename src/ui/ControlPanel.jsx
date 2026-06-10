import "@material/web/button/filled-button.js";
import "@material/web/button/elevated-button";
import "@material/web/fab/fab";
import "@material/web/fab/branded-fab";
import "@material/web/iconbutton/icon-button";
import "@material/web/textfield/outlined-text-field"
import "@material/web/iconbutton/filled-icon-button";
import "@material/web/icon/icon"
import "@material/web/button/filled-tonal-button"
import "@material/web/button/text-button"
import "@material/web/chips/suggestion-chip"

import { For, Show } from "solid-js";
import { useAppState, usePlaylistState, useRemoteState, useRemotePlaylistState, useCurrentVideo } from "../App";
import { createSignal } from "solid-js";
import UsersPanel from "./UsersPanel"

export default () => {
    const [remoteStates, setRemoteStates] = useRemoteState()
    const [currentVideo, setCurrentVideo] = useCurrentVideo()

    const [playlistState, setPlaylistState] = usePlaylistState()
    const [remotePlaylist, setRemotePlaylist] = useRemotePlaylistState()
    const [currentState, setCurrentState] = useAppState()

    const [expanded, setExpanded] = createSignal(false)

    const combinedPlaylist = () => [playlistState(), ...remotePlaylist().values()].flat();

    const onExpand = async () => {
        setExpanded(!expanded());
    }

    const parseLink = (value) => {
        let url = new URL(value);

        if (url.hostname == "www.youtube.com" && url.pathname == "/watch") {
            let v = url.searchParams.get("v");

            if (v != null) {
                return `youtube://${v}`;
            }
        }

        if (url.hostname == "youtu.be") {
            let v = url.pathname.substring(1);
            return `youtube://${v}`
        }

        console.log(url);
    }

    const disconnect = () => {
        window.RTC.leave();
    }

    const onSubmitLink = () => {
        console.log("Submitting link!");
        console.log(textbox.value);

        let state = structuredClone(playlistState());

        let id = parseLink(textbox.value);

        if (id != null) {
            state = [
                ...state,
                id
            ];

            setPlaylistState(state);
        }
    }

    const openVideo = (id) => {
        setCurrentVideo(id);

        let state = structuredClone(currentState());
        state.videoId = id;
        setCurrentState(state);

        if (window.RTC != undefined) {

            window.RTC.sendData({
                type: "command",
                command: "openvideo",
                state: id,
            })
        }
    }

    let textbox;

    return (
        <div class={`${expanded() ? "w-96" : "w-min"} p-2 transition-[width] bg-(--md-sys-color-surface)`}>
            <div class="space-y-2 h-dvh flex-col">
                <md-fab variant="secondary" onclick={onExpand} >
                    <md-icon slot="icon" class={`${expanded() ? "rotate-180" : ""} transition-transform `}>chevron_forward</md-icon>
                </md-fab>

                <Show when={expanded()}>
                    <div class="h-full">
                        <div class="overflow-scroll h-full flex flex-col scrollbar-none py-1">

                            <div class="flex flex-row space-x-2 space-y-2">
                                <md-outlined-text-field ref={textbox} class={"w-full"} label="Enter Link">
                                </md-outlined-text-field>
                                <md-fab onclick={onSubmitLink} variant="primary">
                                    <md-icon slot="icon">check</md-icon>
                                </md-fab>
                            </div>

                            <For each={combinedPlaylist()}>
                                {
                                    (id, index) => {
                                        let url = new URL(id)

                                        console.log(url)
                                        console.log(url.hostname);

                                        if (url.protocol == "youtube:") {
                                            return (
                                                <>
                                                    <a onclick={console.log("Clicked: ", id)}>
                                                        <md-text-button onclick={() => { openVideo(id); }} trailing-icon>
                                                        <iframe class="rounded-3xl pointer-events-none" height="200" src={`https://www.youtube-nocookie.com/embed/${url.hostname}?controls=0&fs=0`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                                        </md-text-button>
                                                    </a>
                                                </>
                                            )
                                        }

                                        return <></>
                                    }
                                }
                            </For>
                        </div>
                    </div>
                </Show>

                <Show when={expanded() == false}>
                    <UsersPanel></UsersPanel>
                </Show>
            </div>
        </div>
    )
};
