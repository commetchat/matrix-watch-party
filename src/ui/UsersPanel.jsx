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
import { useAppState, usePlaylistState, useRemoteState, useCallMemberships, useUserAvatars, useLocalMembership, useRemotePlaylistState, useCurrentVideo } from "../App";
import { createSignal, createEffect } from "solid-js";
import MemberView from "./MemberView";

export default () => {
    const [memberships] = useCallMemberships()

    createEffect(() => {
        console.log("Call state members changed: ", memberships());
    });

    return (
        <div class="flex-col flex">

            <For each={memberships()}>
                {key => {
                    return (
                        <div class="memberview">
                            <MemberView member={key}></MemberView>
                        </div>
                    );
                }}
            </For>
        </div>

    );
}