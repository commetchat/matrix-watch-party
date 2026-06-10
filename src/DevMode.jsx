
import * as sdk from "./matrixrtc/matrixrtc-sdk";
import { createEffect, onMount, Show } from "solid-js";
import VideoPlayer from './ui/VideoPlayer';
import ControlPanel from './ui/ControlPanel';

const DevMode = () => {

  let iframe1, iframe2, iframe3, iframe4, iframe5, iframe6, iframe7, iframe8, iframe9;

  let numFrames = 4;

  let connected = new Array();

  const connect = (iframe) => {
    
    var sender = iframe.id;
    iframe.contentWindow.postMessage({
      from: sender,
      data: {
        type: "connect"
      }
    })
    
    let frames = connected;
    
    frames.forEach((f1) => {
        f1.contentWindow.postMessage({
          from: sender,
          data: {
            type: "join"
          }
        })

        iframe.contentWindow.postMessage({
          from: f1.id,
          data: {
            type: "join"
          }
        })
    })


    
    connected.push(iframe);
  }

  const onMessage = (v) => {

    let sender = null;

    var isConnected = false;
    connected.forEach((frame) => {

      if (frame == undefined) return;

      if (v.source == frame.contentWindow) {
        sender = frame.id;
        isConnected = true;
      }
    })

    if(isConnected == false) return;


    connected.forEach((frame) => {
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

      <div class="grid-cols-2 w-screen h-screen grid gap-3"   >
        <Show when={numFrames >= 1}  >
          <div>
            <button onclick={() => connect(iframe1)} type="button">Connect</button>
            <iframe id="alice" ref={iframe1} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 2}  >
          <div>
            <button onclick={() => connect(iframe2)} type="button">Connect</button>
            <iframe id="bob" ref={iframe2} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 3}  >
          <div>
            <button onclick={() => connect(iframe3)} type="button">Connect</button>
            <iframe id="charlie" ref={iframe3} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 4}  >
          <div>
            <button onclick={() => connect(iframe4)} type="button">Connect</button>
            <iframe id="dan" ref={iframe4} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 5}  >
          <div>
            <button onclick={() => connect(iframe5)} type="button">Connect</button>
            <iframe id="edward" ref={iframe5} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 6}  >
          <div>
            <button onclick={() => connect(iframe6)} type="button">Connect</button>
            <iframe id="frank" ref={iframe6} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 7}  >
          <div>
            <button onclick={() => connect(iframe7)} type="button">Connect</button>
            <iframe id="goblin" ref={iframe7} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 8}  >
          <div>
            <button onclick={() => connect(iframe8)} type="button">Connect</button>
            <iframe id="hatman" ref={iframe8} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>

        <Show when={numFrames >= 9}  >
          <div>
            <button onclick={() => connect(iframe9)} type="button">Connect</button>
            <iframe id="ivan" ref={iframe9} class="w-full h-full" src="/mock" ></iframe>
          </div>
        </Show>
      </div>
    </div>
    </>
  );
};

export default DevMode;
