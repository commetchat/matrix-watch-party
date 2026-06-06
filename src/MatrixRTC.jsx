
import * as sdk from "./matrixrtc/matrixrtc-sdk";
import VideoPlayer from './ui/VideoPlayer';
import ControlPanel from './ui/ControlPanel';
import "@material/web/progress/circular-progress.js";
import { createEffect, onMount, Show, createSignal  } from "solid-js";
import App from './App';
import { applyMaterialTheme } from "./utils";

const MatrixRTCApp = () => {


    const [connected, setConnected] = createSignal(false);

    onMount(async () => {

        try {
            console.log("Creating sdk");
            window.RTC = await sdk.createMatrixRTCSdk("chat.commet.matrix-watch-party")
            console.log("Finished creating sdk");
            const rtc = window.RTC;

            window.RTC.widget.api.on("action:theme_change", (event) => {
                console.log(event.detail); 
                let colorScheme = event.detail.data["chat.commet.color_scheme"];
                console.log("Color scheme: ", colorScheme);

                if(colorScheme != undefined) {
                    console.log("Applying!")
                    applyMaterialTheme(colorScheme)
                }
            });

            console.log("Joining");
            const connectionState = rtc.join();
            console.log("Finished joining!");
        } catch(e) {
            alert("Failed to init matrix rtc! ");
            console.log(e);
        }

        console.log("Setting connected state!");
        setConnected(true);
    })

    return (
        <>
            <Show when={connected()}>
                <App></App>
            </Show>
            
            <Show when={connected() == false} >
                <div class="w-svw h-svh p-2 content-center justify-center text-center flex items-center bg-(--md-sys-color-surface-container-low)">
                    <md-circular-progress class="self-center" indeterminate></md-circular-progress>
                </div>
            </Show>
        </>
    );
};

export default MatrixRTCApp;
