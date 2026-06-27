import { EME_CALLS, NativeMediaEncryptedEvent } from "./constants.js";
import spyOnWholeObject from "./utils/spyOnWholeObject.js";

export default function spyOnMediaEncryptedEvent() {
  return spyOnWholeObject(
    // Object to spy on
    NativeMediaEncryptedEvent,

    // name in window
    "MediaEncryptedEvent",

    // read-only properties
    ["initDataType", "initData"],

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
