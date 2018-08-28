import spyOnMethods from "./utils/spyOnMethods.js";
import { EME_CALLS } from "./constants.js";

export default function spyOnRequestMediaKeySystemAccess() {
  return spyOnMethods(
    navigator,
    ["requestMediaKeySystemAccess"],
    "navigator",
    EME_CALLS
  );
}

