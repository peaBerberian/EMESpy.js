import spyOnMethods from "./utils/spyOnMethods.js";
import { EME_CALLS } from "./constants.js";

export default function spyOnSetMediaKeys() {
  return spyOnMethods(
    HTMLMediaElement.prototype,
    ["setMediaKeys"],
    "HTMLMediaElement.prototype",
    EME_CALLS
  );
}
