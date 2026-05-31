
import { createEffect, onMount } from "solid-js";
import App from './App';

class Stream {
  constructor() {
    this._events = new EventTarget();
  }
  
  subscribe(callback) {
    this._events.addEventListener("event", (ev) => {
      callback(ev.data);
    });
  }

  add(data) {
    var ev = new Event("event");
    ev.data = data

    this._events.dispatchEvent(ev)
  }
}

class MockRTC {

  constructor() {
    this.data$ = new Stream();
    this.members$ = new Stream();

    window.addEventListener("message", (msg) => {
      if(msg.source != window.parent) return;
      
      let from = msg.data.from;
      let data = msg.data.data.data;
      let type = msg.data.data.type;

      if(type == "sendData") {
        this.data$.add({
          "rtcBackendIdentity": from,
          "data": JSON.stringify(data)
        })
      }
    });
  }

  sendData(data) {
    window.parent.postMessage({
      "type": "sendData",
      "data": data,
    });
  }

  leave() {
    console.log("Mock leaving call");
  }
}

const MockRTCApp = () => {

  onMount(async () => {
    window.RTC = new MockRTC();
  })

  return (
    <App></App>
  );
};

export default MockRTCApp;
