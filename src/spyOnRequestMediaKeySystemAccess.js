import { EME_CALLS } from "./constants.js";
import spyOnMethods from "./utils/spyOnMethods.js";

export default function spyOnRequestMediaKeySystemAccess() {
  return spyOnMethods(
    navigator,
    ["requestMediaKeySystemAccess"],
    "navigator",
    EME_CALLS,
  );
}
