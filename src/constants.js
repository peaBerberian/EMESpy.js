/**
 * Store information about every EME Calls stubbed in this file.
 * @type {Object}
 */
const EME_CALLS = {};

function getEMECalls() {
  return EME_CALLS;
}

function resetEMECalls() {
  Object.keys(EME_CALLS).forEach(key => {
    delete EME_CALLS[key];
  });
}

const NativeMediaKeys = window.MediaKeys;
const NativeMediaKeySession = window.MediaKeySession;
const NativeMediaKeySystemAccess = window.MediaKeySystemAccess;

export {
  EME_CALLS,
  getEMECalls,
  resetEMECalls,
  NativeMediaKeys,
  NativeMediaKeySession,
  NativeMediaKeySystemAccess,
};
