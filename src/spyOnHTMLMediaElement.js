import { EME_CALLS } from "./constants.js";
import spyOnEventHandlerProperties from "./utils/spyOnEventHandlerProperties.js";
import spyOnEventTarget from "./utils/spyOnEventTarget.js";
import spyOnMethods from "./utils/spyOnMethods.js";
import spyOnReadOnlyProperties from "./utils/spyOnReadOnlyProperties.js";

export default function spyOnHTMLMediaElement() {
  if (typeof HTMLMediaElement === "undefined") {
    console.warn(
      "Cannot spy on HTMLMediaElement: native object is unavailable",
    );
    return null;
  }

  if (EME_CALLS.HTMLMediaElement == null) {
    EME_CALLS.HTMLMediaElement = {
      properties: {},
      eventListeners: {},
    };
  }

  const htmlMediaElementDescriptors = Object.getOwnPropertyDescriptors(
    HTMLMediaElement.prototype,
  );

  const resetMethods = spyOnMethods(
    HTMLMediaElement.prototype,
    ["setMediaKeys"],
    "HTMLMediaElement.prototype",
    EME_CALLS,
  );
  const resetReadOnlyProperties = spyOnReadOnlyProperties(
    HTMLMediaElement.prototype,
    htmlMediaElementDescriptors,
    ["mediaKeys"],
    "HTMLMediaElement.prototype",
    EME_CALLS.HTMLMediaElement.properties,
  );
  const resetEventHandlers = spyOnEventHandlerProperties(
    HTMLMediaElement.prototype,
    ["onencrypted", "onwaitingforkey"],
    "HTMLMediaElement.prototype",
    EME_CALLS.HTMLMediaElement.eventListeners,
  );
  const resetEventTarget = spyOnEventTarget(
    HTMLMediaElement.prototype,
    ["encrypted", "waitingforkey"],
    "HTMLMediaElement.prototype",
    EME_CALLS.HTMLMediaElement.eventListeners,
  );

  return function stopSpyingOnHTMLMediaElement() {
    resetEventTarget && resetEventTarget();
    resetEventHandlers && resetEventHandlers();
    resetReadOnlyProperties && resetReadOnlyProperties();
    resetMethods && resetMethods();
  };
}
