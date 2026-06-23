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
import { useAppState, usePlaylistState, useRemoteState, useCallMemberships, useUserAvatars, useLocalMembership, useRemotePlaylistState, useCurrentVideo, useLeader } from "../App";
import { createSignal, createMemo } from "solid-js";
import MemberView from "./MemberView";


function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    const hr = String(hrs).padStart(2, '0');
    return hrs === 0 ? `${mm}:${ss}` : `${hr}:${mm}:${ss}`;
}


export default (props) => {
    const [remoteStates, setRemoteStates] = useRemoteState()
    const [playbackState, setPlaybackState] = useAppState()
    const [avatars, _setUserAvatars] = useUserAvatars();
    const [localMembership] = useLocalMembership();
    const [leader, setLeader] = useLeader();

    const isSelf = createMemo(() => {
        const membership = localMembership();
        return membership
            ? membership.membership.rtcBackendIdentity === props.member
            : false;
    });

    const state = createMemo(() => {
        if (isSelf()) {
            return playbackState();
        }

        return remoteStates().get(props.member);
    });

    const isLeader = createMemo(() => {
        return props.member == leader()
    })

    const avatar = createMemo(() => {
        let s = props.member.split(":");
        let userId = s[0] + ":" + s[1];
        return avatars().get(userId);
    });

    return (
        <div class="py-2">
            <div class={`w-[56px] h-[56px] rounded-2xl bg-cover ${isLeader() ? " outline-4 outline-(--md-sys-color-primary) outline-solid " : ""} `} style={avatar() == null ? {
                "background": "var(--md-sys-color-surface-container)",
            } : {
                "background-image": `url(${avatar()})`,
            }}>
                <Show when={state() != null}>
                    <div class={`p-1 py-5 text-center relative ${state().progress > 3600 ? "text-[10px]" : "text-xs"}`}>
                        <div class={`absolute -right-1 -bottom-5 ${isSelf() ? "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)" : "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"} p-0.5 rounded `}>
                            {formatTime(state().progress)}
                        </div>
                    </div>
                </Show>
            </div>

        </div>
    )
}