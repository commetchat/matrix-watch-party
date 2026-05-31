
import * as sdk from "./matrixrtc/matrixrtc-sdk";
import VideoPlayer from './ui/VideoPlayer';
import ControlPanel from './ui/ControlPanel';

import { createEffect, onMount, Show, createSignal  } from "solid-js";
import App from './App';

const MatrixRTCApp = () => {


    const [connected, setConnected] = createSignal(false);

    onMount(async () => {
        window.RTC = await sdk.createMatrixRTCSdk("chat.commet.matrix-watch-party")

        const rtc = window.RTC;
        const connectionState = rtc.join();

        setConnected(true);
    })

    return (
        <>
            <Show when={connected()}>
                <App></App>
            </Show>
        </>
    );
};

export default MatrixRTCApp;
