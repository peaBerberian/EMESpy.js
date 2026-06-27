import { getEMECalls, resetEMECalls } from "./constants.js";
import spyOnHTMLMediaElement from "./spyOnHTMLMediaElement.js";
import spyOnMediaEncryptedEvent from "./spyOnMediaEncryptedEvent.js";
import spyOnMediaKeyMessageEvent from "./spyOnMediaKeyMessageEvent.js";
import spyOnMediaKeySession from "./spyOnMediaKeySession.js";
import spyOnMediaKeyStatusMap from "./spyOnMediaKeyStatusMap.js";
import spyOnMediaKeySystemAccess from "./spyOnMediaKeySystemAccess.js";
import spyOnMediaKeys from "./spyOnMediaKeys.js";
import spyOnRequestMediaKeySystemAccess from "./spyOnRequestMediaKeySystemAccess.js";
import Logger from "./utils/logger.js";

let resetSpies = null;

/**
 * Start/restart spying on EME API calls.
 */
function start() {
  if (resetSpies != null) {
    resetSpies();
  }

  const resetSpyFunctions = [
    spyOnMediaKeys(),
    spyOnMediaKeyStatusMap(),
    spyOnMediaKeySession(),
    spyOnMediaKeySystemAccess(),
    spyOnMediaEncryptedEvent(),
    spyOnMediaKeyMessageEvent(),
    spyOnRequestMediaKeySystemAccess(),
    spyOnHTMLMediaElement(),
  ].filter((cb) => cb);

  resetSpies = function resetEverySpies() {
    resetSpyFunctions.forEach((fn) => {
      fn && fn();
    });
    resetSpyFunctions.length = 0;
    resetSpies = null;
  };
}

/**
 * Stop spying on EME API calls.
 */
function stop() {
  if (resetSpies != null) {
    resetSpies();
  }
}

export { getEMECalls, Logger, resetEMECalls, start, stop };
