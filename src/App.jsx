
import * as sdk from "./matrixrtc/matrixrtc-sdk";
import { createEffect, createSignal, onMount, onCleanup, Show } from "solid-js";
import VideoPlayer from './ui/VideoPlayer';
import { createStore } from 'solid-js/store'
import ControlPanel from './ui/ControlPanel';
import MemberState from "./state/PlaybackState";

const [localUserState, setLocalUserState] = createSignal(new MemberState())
const [localMembership, setLocalMembership] = createSignal(null);

const [memberships, setMemberships] = createSignal();

const [currentVideo, setCurrentVideo] = createSignal("");
const [remoteUserStates, setRemoteUserStates] = createSignal(new Map())
const [playlistState, setPlaylistState] = createSignal(new Array())
const [remotePlaylistState, setRemotePlaylistState] = createSignal(new Map())
const [leader, setLeader] = createSignal("")

const [userMembershipData, setUserMembershipData] = createSignal(new Map());
const [userAvatars, setUserAvatars] = createSignal(new Map());
const [hideUI, setHideUI] = createSignal(false);

export const useAppState = () => [localUserState, setLocalUserState]
export const useRemoteState = () => [remoteUserStates, setRemoteUserStates]
export const usePlaylistState = () => [playlistState, setPlaylistState]
export const useRemotePlaylistState = () => [remotePlaylistState, setRemotePlaylistState]
export const useCurrentVideo = () => [currentVideo, setCurrentVideo]
export const useUserAvatars = () => [userAvatars, setUserAvatars]

export const useLocalMembership = () => [localMembership];
export const useCallMemberships = () => [memberships];
export const useLeader = () => [leader, setLeader];
export const useHideUI = () => [hideUI, setHideUI];

const App = (props) => {

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

  const onMembersChanged = (members) => {
    console.log("Members changed!", members);
    console.log("RTC: ", window.RTC);
    let map = userMembershipData();

    let memberIds = Array.from(members.map((i) => i.membership.rtcBackendIdentity))
    console.log(memberIds)

    console.log("Memberships changed!", memberIds);
    setMemberships(memberIds);


    members.forEach(element => {
      console.log(element)
      var id = element.membership.rtcBackendIdentity;
      var sender = element.membership.matrixEventData.sender;
      var roomId = element.membership.matrixEvent.event.room_id;

      if (map.has(sender) == false) {
        map = new Map(map);
        map.set(sender, null);
        setUserMembershipData(map);

        if (window.RTC.widget != undefined) {


          window.RTC.widget.api.readStateEvents("m.room.member", 1, sender, [roomId]).then((result) => {
            console.log("Received user membership state: ", result);
            let data = userMembershipData();
            data = new Map(data);
            data.set(sender, result[0]);

            setUserMembershipData(data);
          });
        }
      }

    });


    window.RTC.sendData({
      type: "state_update",
      state: localUserState(),
    })
  }

  createEffect(() => {
    let memberStates = userMembershipData();

    memberStates.keys().forEach((key) => {

      let avatars = userAvatars();
      if (avatars.has(key)) return;

      let state = memberStates.get(key);
      if (state == null) return;


      //window.RTC.widget.api.downloadFile();

      if (state.content == null) return;

      let avatar_url = state.content.avatar_url;

      if (avatar_url == null) return;

      if (avatars.has(key)) return;

      avatars = new Map(avatars);
      avatars.set(key, null);
      setUserAvatars(avatars);


      console.log("Fetching user avatar: ", key);
      console.log(state);
      console.log("")
      console.log(avatar_url);

      window.RTC.widget.api.downloadFile(avatar_url).then((result) => {
        console.log("Downloaded avatar: ", result);
        avatars = new Map(userAvatars());
        avatars.set(key, URL.createObjectURL(result.file));

        setUserAvatars(avatars);
        console.log("User Avatars: ", avatars);
      });
    });
  });

  const onConnectionStatusChanged = (status) => {
    console.log("Connection status changed: ", status);
  }

  const onLocalMembershipChanged = (membership) => {
    console.log("Local membership changed: ", membership);
    setLocalMembership(membership)

    window.RTC.sendData({
      type: "state_update",
      state: localUserState(),
    })
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

  const sendPlaylistData = (members) => {
    if (window.RTC != undefined) {
      window.RTC.sendData({
        type: "playlist",
        state: playlistState(),
      })
    }
  }

  onMount(() => {
    window.RTC.data$.subscribe(onReceivedData);
    window.RTC.members$.subscribe(onMembersChanged);
    window.RTC.members$.subscribe(sendPlaylistData);
    window.RTC.connected$.subscribe(onConnectionStatusChanged);
    window.RTC.localMember$.subscribe(onLocalMembershipChanged);
  });

  const revealSidebar = () => {
    console.log("HLASKDALSKDJASLDK");
    setHideUI(false);
  }

  return (
    <>
      <div style={{ overflow: "clip", height: "100dvh", width: "100dvw", background: "#0c0c0c" }}>
        <div style={{ height: "100dvh", width: "100dvw", display: "flex" }}>
          <Show when={rect().height > 200 && rect().width > 200 && hideUI() == false}>
            <ControlPanel></ControlPanel>
          </Show>
          <div class="w-full h-full" onclick={revealSidebar}>
            <div class={`w-full h-full ${hideUI() ? `pointer-events-none` : ""}`} >
              <VideoPlayer debugMode={props.debugMode == true}></VideoPlayer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
