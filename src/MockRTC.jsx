
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
    this.connected$ = new Stream();
    this.localMember$ = new Stream();

    this._members = new Array();

    window.addEventListener("message", (msg) => {
      if (msg.source != window.parent) return;

      let from = msg.data.from;
      let data = msg.data.data.data;
      let type = msg.data.data.type;

      if (type == "connect") {
        this._localUserId = from;
        this.localMember$.add({
          membership: {
            rtcBackendIdentity: from,
            matrixEventData: {
              sender: from,
            },
            matrixEvent: {
              event: {
                room_id: "!fakeroom:example.com"
              }
            }
          }
        })

        this._members.push({
          membership: {
            rtcBackendIdentity: from,
            matrixEventData: {
              sender: from,
            },
            matrixEvent: {
              event: {
                room_id: "!fakeroom:example.com"
              }
            }
          }
        })

        this.members$.add(this._members);
      }

      if (type == "join") {
        console.log(`${this._localUserId} Received member joined! ${from}`);

        this._members.push({
          membership: {
            rtcBackendIdentity: from,
            matrixEventData: {
              sender: from,
            },
            matrixEvent: {
              event: {
                room_id: "!fakeroom:example.com"
              }
            }
          }
        })

        console.log(this._members);

        this.members$.add(this._members);
      }

      if (type == "sendData") {
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
    
    const urlParams = new URLSearchParams(window.location.search)
    var id = urlParams.get("dev_user_id");
    
    var log = console.log;
    console.log = (data) => {
      log(`${id}] `, data);
    }
  })

  return (
    <App debugMode={true}></App>
  );
};

export default MockRTCApp;
