
import * as sdk from "./matrixrtc/matrixrtc-sdk";
import { createEffect, onMount, Show } from "solid-js";
import VideoPlayer from './ui/VideoPlayer';
import ControlPanel from './ui/ControlPanel';

const DevMode = () => {

  let iframe1, iframe2, iframe3, iframe4, iframe5, iframe6, iframe7, iframe8, iframe9;

  let numFrames = 3;

  const onMessage = (v) => {
    let frames = [iframe1, iframe2, iframe3, iframe4, iframe5, iframe6, iframe7, iframe8, iframe9];

    let sender = null;
    frames.forEach((frame) => {

      if (frame == undefined) return;

      if (v.source == frame.contentWindow) {
        sender = frame.id;
      }
    })


    frames.forEach((frame) => {
      if (frame == undefined) return;

      if (v.source == frame.contentWindow) {
        return;
      }

      if (frame.contentWindow == null || frame.contentWindow == undefined) return;

      frame.contentWindow.postMessage({
        from: sender,
        data: v.data
      })
    });
  }

  onMount(() => {
    window.addEventListener("message", onMessage);
  });

  return (
    <><div class="bg-stone-600">

      <div class="grid-cols-3 w-screen h-screen grid gap-3"   >
        <Show when={numFrames >= 1}  >
          <iframe id="alice" ref={iframe1} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 2}  >
          <iframe id="bob" ref={iframe2} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 3}  >
          <iframe id="charlie" ref={iframe3} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 4}  >
          <iframe id="dan" ref={iframe4} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 5}  >
          <iframe id="edward" ref={iframe5} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 6}  >
          <iframe id="frank" ref={iframe6} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 7}  >
          <iframe id="goblin" ref={iframe7} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 8}  >
          <iframe id="hatman" ref={iframe8} class="w-full h-full" src="/mock" ></iframe>
        </Show>

        <Show when={numFrames >= 9}  >
          <iframe id="ivan" ref={iframe9} class="w-full h-full" src="/mock" ></iframe>
        </Show>
      </div>
    </div>
    </>
  );
};

export default DevMode;
