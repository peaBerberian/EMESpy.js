import {
  getEMECalls,
  resetEMECalls,
} from "./constants.js";
import Logger from "./utils/logger.js";
import spyOnMediaKeys from "./spyOnMediaKeys.js";
import spyOnMediaKeySession from "./spyOnMediaKeySession.js";
import spyOnMediaKeySystemAccess from "./spyOnMediaKeySystemAccess.js";
import spyOnRequestMediaKeySystemAccess from "./spyOnRequestMediaKeySystemAccess.js";
import spyOnSetMediaKeys from "./spyOnSetMediaKeys.js";

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
    spyOnMediaKeySession(),
    spyOnMediaKeySystemAccess(),
    spyOnRequestMediaKeySystemAccess(),
    spyOnSetMediaKeys(),
  ].filter(cb => cb);

  resetSpies = function resetEverySpies() {
    resetSpyFunctions.forEach(fn => { fn && fn(); });
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

export {
  getEMECalls,
  resetEMECalls,
  Logger,
  start,
  stop,
};
