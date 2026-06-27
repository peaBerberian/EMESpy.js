import { EME_CALLS, NativeMediaKeySession } from "./constants.js";
import spyOnEventHandlerProperties from "./utils/spyOnEventHandlerProperties.js";
import spyOnEventTarget from "./utils/spyOnEventTarget.js";
import spyOnWholeObject from "./utils/spyOnWholeObject.js";

export default function spyOnMediaKeySession() {
  const resetWholeObject = spyOnWholeObject(
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
    EME_CALLS,
  );

  if (
    NativeMediaKeySession == null ||
    NativeMediaKeySession.prototype == null
  ) {
    return resetWholeObject;
  }

  if (EME_CALLS.MediaKeySession == null) {
    EME_CALLS.MediaKeySession = {
      new: [],
      methods: {},
      staticMethods: {},
      properties: {},
      eventListeners: {},
    };
  }

  const resetEventHandlers = spyOnEventHandlerProperties(
    NativeMediaKeySession.prototype,
    ["onmessage", "onkeystatuseschange"],
    "MediaKeySession.prototype",
    EME_CALLS.MediaKeySession.eventListeners,
  );
  const resetEventTarget = spyOnEventTarget(
    NativeMediaKeySession.prototype,
    ["message", "keystatuseschange"],
    "MediaKeySession.prototype",
    EME_CALLS.MediaKeySession.eventListeners,
  );

  return function stopSpyingOnMediaKeySession() {
    resetEventTarget && resetEventTarget();
    resetEventHandlers && resetEventHandlers();
    resetWholeObject && resetWholeObject();
  };
}
