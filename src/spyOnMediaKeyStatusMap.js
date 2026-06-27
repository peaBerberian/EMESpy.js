import { EME_CALLS, NativeMediaKeyStatusMap } from "./constants.js";
import spyOnWholeObject from "./utils/spyOnWholeObject.js";

export default function spyOnMediaKeyStatusMap() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeyStatusMap,

    // name in window
    "MediaKeyStatusMap",

    // read-only properties
    ["size"],

    // regular properties
    [],

    // static methods
    [],

    // methods
    ["get", "has", "entries", "keys", "values", "forEach", Symbol.iterator],

    // global logging object
    EME_CALLS,
  );
}
