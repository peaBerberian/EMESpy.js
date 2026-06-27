import { EME_CALLS, NativeMediaKeys } from "./constants.js";
import spyOnWholeObject from "./utils/spyOnWholeObject.js";

export default function spyOnMediaKeys() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeys,

    // name in window
    "MediaKeys",

    // read-only properties
    [],

    // regular properties
    [],

    // static methods
    [],

    // methods
    ["createSession", "setServerCertificate"],

    // global logging object
    EME_CALLS,
  );
}
