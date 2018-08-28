import spyOnWholeObject from "./utils/spyOnWholeObject.js";
import {
  EME_CALLS,
  NativeMediaKeySession,
} from "./constants.js";

export default function spyOnMediaKeySession() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeySession,

    // name in window
    "MediaKeySession",

    // read-only properties
    ["sessionId", "expiration", "closed", "keyStatuses"],

    // regular properties
    [],

    // static methods
    [],

    // methods
    ["generateRequest", "load", "update", "close", "remove"],

    // global logging object
    EME_CALLS
  );
}
