/**
 * Store information about every EME Calls stubbed in this file.
 * @type {Object}
 */
const EME_CALLS = {};

function getEMECalls() {
  return EME_CALLS;
}

function resetEMECalls() {
  Object.keys(EME_CALLS).forEach((key) => {
    delete EME_CALLS[key];
  });
}

const currentWindow = typeof window !== "undefined" ? window : {};

const NativeMediaEncryptedEvent = currentWindow.MediaEncryptedEvent;
const NativeMediaKeyMessageEvent = currentWindow.MediaKeyMessageEvent;
const NativeMediaKeys = currentWindow.MediaKeys;
const NativeMediaKeySession = currentWindow.MediaKeySession;
const NativeMediaKeyStatusMap = currentWindow.MediaKeyStatusMap;
const NativeMediaKeySystemAccess = currentWindow.MediaKeySystemAccess;

export {
  EME_CALLS,
  getEMECalls,
  NativeMediaEncryptedEvent,
  NativeMediaKeyMessageEvent,
  NativeMediaKeySession,
  NativeMediaKeyStatusMap,
  NativeMediaKeySystemAccess,
  NativeMediaKeys,
  resetEMECalls,
};
