export const PlaybackStates = Object.freeze({
    PLAYING: "playing",
    PAUSED: "paused",
    ENDED: "ended",
    BUFFERING: "buffering",
    UNSTARTED: "unstarted",
});

export default class MemberState {
    targetState = PlaybackStates.UNSTARTED;
    currentState = PlaybackStates.UNSTARTED;
    progress = 0.0
    videoId = null
    following = ""
}