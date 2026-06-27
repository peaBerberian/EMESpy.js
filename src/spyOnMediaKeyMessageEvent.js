import { EME_CALLS, NativeMediaKeyMessageEvent } from "./constants.js";
import spyOnWholeObject from "./utils/spyOnWholeObject.js";

export default function spyOnMediaKeyMessageEvent() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeyMessageEvent,

    // name in window
    "MediaKeyMessageEvent",

    // read-only properties
    ["messageType", "message"],

    // regular properties
    [],

    // static methods
    [],

    // methods
    [],

    // global logging object
    EME_CALLS,
  );
}
