import spyOnWholeObject from "./utils/spyOnWholeObject.js";
import {
  EME_CALLS,
  NativeMediaKeySystemAccess,
} from "./constants.js";

export default function spyOnMediaKeySystemAccess() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeySystemAccess,

    // name in window
    "MediaKeySystemAccess",

    // read-only properties
    ["keySystem"],

    // regular properties
    [],

    // static methods
    [],

    // methods
    ["getConfiguration", "createMediaKeys"],

    // global logging object
    EME_CALLS
  );
}
