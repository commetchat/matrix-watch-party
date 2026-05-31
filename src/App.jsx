
import * as sdk from "./matrixrtc/matrixrtc-sdk";
import { createEffect, createSignal, onMount, onCleanup, Show } from "solid-js";
import VideoPlayer from './ui/VideoPlayer';
import { createStore } from 'solid-js/store'
import ControlPanel from './ui/ControlPanel';
import MemberState from "./state/PlaybackState";

const [localUserState, setLocalUserState] = createSignal(new MemberState())
const [currentVideo, setCurrentVideo] = createSignal("");
const [remoteUserStates, setRemoteUserStates] = createSignal(new Map())
const [playlistState, setPlaylistState] = createSignal(new Array())
const [remotePlaylistState, setRemotePlaylistState] = createSignal(new Map())

export const useAppState = () => [localUserState, setLocalUserState]
export const useRemoteState = () => [remoteUserStates, setRemoteUserStates]
export const usePlaylistState = () => [playlistState, setPlaylistState]
export const useRemotePlaylistState = () => [remotePlaylistState, setRemotePlaylistState]
export const useCurrentVideo = () => [currentVideo, setCurrentVideo]

const App = () => {

  const onReceivedData = (data) => {
    var msg = JSON.parse(data.data);

    if (msg.type == "playlist") {
      console.log("Received playlist update");
      let prevMap = remotePlaylistState();

      let map = new Map(prevMap);

      map.set(data.rtcBackendIdentity, msg.state);

      console.log(map);

      setRemotePlaylistState(map);
    }
  }

  const [rect, setRect] = createSignal({
    height: window.innerHeight,
    width: window.innerWidth
  });

  const handler = (event) => {
    setRect({ height: window.innerHeight, width: window.innerWidth });
  };

  onMount(() => {
    window.addEventListener('resize', handler);
  });

  onCleanup(() => {
    window.removeEventListener('resize', handler);
  })

  createEffect(() => {
    if (window.RTC != undefined) {
      window.RTC.sendData({
        type: "playlist",
        state: playlistState(),
      })
    }
  });

  onMount(() => {
    window.RTC.data$.subscribe(onReceivedData);
  });


  return (
    <>
      <div style={{ overflow: "clip", height: "100dvh", width: "100dvw", background: "#0c0c0c" }}>
        <div style={{ height: "100dvh", width: "100dvw", display: "flex" }}>
          <Show when={rect().height > 300 && rect().width > 300}>
          <ControlPanel></ControlPanel>
          </Show>
          <VideoPlayer></VideoPlayer>
        </div>
      </div>
    </>
  );
};

export default App;
