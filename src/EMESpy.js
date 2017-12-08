/**
 * Store information about every EME Calls stubbed in this file.
 * @type {Object}
 */
const EME_CALLS = {
  close: [],
  createMediaKeys: [],
  createSession: [],
  generateRequest: [],
  getConfiguration: [],
  load: [],
  remove: [],
  requestMediaKeySystemAccess: [],
  setMediaKeys: [],
  setServerCertificate: [],
  update: [],
};

/**
 * Define the logger for spyEME.
 * Allows to re-define a specific logger on runtime / before applying this
 * script.
 * @type {Object}
 */
const spyLogger = window.spyLogger || {
  /* eslint-disable no-console */
  log: function(...args) {
    console.log(...args);
  },
  debug: function(...args) {
    console.debug(...args);
  },
  info: function(...args) {
    console.info(...args);
  },
  error: function(...args) {
    console.error(...args);
  },
  warning: function(...args) {
    console.warning(...args);
  },
  /* eslint-enable no-console */
};

/**
 * Start spying on EME API calls.
 * @returns {Object} - Object with a "restore" function, restoring all stubs
 * done here.
 */
function spyEME() {
  /**
   * Log when a function is called with its arguments.
   * @param {string} fnName
   * @param {Array.<*>} args
   */
  function onAPICall(fnName, args) {
    if (args.length) {
      spyLogger.debug(`>>> ${fnName} called with arguments:`, args);
    } else {
      spyLogger.debug(`>>> ${fnName} called`);
    }
  }
  const saveRequestMediaKeySystemAccess = navigator.requestMediaKeySystemAccess;
  navigator.requestMediaKeySystemAccess = function(...args) {
    onAPICall("navigator.requestMediaKeySystemAccess", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.requestMediaKeySystemAccess.push(myObj);

    let prom;
    try {
      prom = saveRequestMediaKeySystemAccess.apply(navigator, args);
    } catch (e) {
      spyLogger.error(">> navigator.requestMediaKeySystemAccess failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> navigator.requestMediaKeySystemAccess resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> navigator.requestMediaKeySystemAccess rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const saveUpdate = MediaKeySession.prototype.update;
  MediaKeySession.prototype.update = function(...args) {
    onAPICall("MediaKeySession.prototype.update", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.update.push(myObj);
    let prom;
    try {
      prom = saveUpdate.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySession.prototype.update failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeySession.prototype.update resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeySession.prototype.update rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const saveload = MediaKeySession.prototype.load;
  MediaKeySession.prototype.load = function(...args) {
    onAPICall("MediaKeySession.prototype.load", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.load.push(myObj);
    let prom;
    try {
      prom = saveload.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySession.prototype.load failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeySession.prototype.load resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeySession.prototype.load rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const saveremove = MediaKeySession.prototype.remove;
  MediaKeySession.prototype.remove = function(...args) {
    onAPICall("MediaKeySession.prototype.remove", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.remove.push(myObj);
    let prom;
    try {
      prom = saveremove.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySession.prototype.remove failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeySession.prototype.remove resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeySession.prototype.remove rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const saveclose = MediaKeySession.prototype.close;
  MediaKeySession.prototype.close = function(...args) {
    onAPICall("MediaKeySession.prototype.close", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.close.push(myObj);
    let prom;
    try {
      prom = saveclose.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySession.prototype.close failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeySession.prototype.close resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeySession.prototype.close rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const savegenerateRequest = MediaKeySession.prototype.generateRequest;
  MediaKeySession.prototype.generateRequest = function(...args) {
    onAPICall("MediaKeySession.prototype.generateRequest", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.generateRequest.push(myObj);
    let prom;
    try {
      prom = savegenerateRequest.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySession.prototype.generateRequest failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeySession.prototype.generateRequest resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeySession.prototype.generateRequest rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const savecreateSession = MediaKeys.prototype.createSession;
  MediaKeys.prototype.createSession = function(...args) {
    onAPICall("MediaKeys.prototype.createSession", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.createSession.push(myObj);
    let session;
    try {
      session = savecreateSession.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeys.prototype.createSession failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    spyLogger.debug(">> MediaKeys.prototype.createSession succeeded:", session);
    myObj.response = session;
    myObj.responseDate = Date.now();
    return session;
  };

  const savesetServerCertificate = MediaKeys.prototype.setServerCertificate;
  MediaKeys.prototype.setServerCertificate = function(...args) {
    onAPICall("MediaKeys.prototype.setServerCertificate", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.setServerCertificate.push(myObj);
    let prom;
    try {
      prom = savesetServerCertificate.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeys.prototype.setServerCertificate failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeys.prototype.setServerCertificate resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeys.prototype.setServerCertificate rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const savecreateMediaKeys = MediaKeySystemAccess.prototype.createMediaKeys;
  MediaKeySystemAccess.prototype.createMediaKeys = function(...args) {
    onAPICall("MediaKeySystemAccess.prototype.createMediaKeys", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.createMediaKeys.push(myObj);
    let prom;
    try {
      prom = savecreateMediaKeys.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySystemAccess.prototype.createMediaKeys failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> MediaKeySystemAccess.prototype.createMediaKeys resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> MediaKeySystemAccess.prototype.createMediaKeys rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  const savegetConfiguration = MediaKeySystemAccess.prototype.getConfiguration;
  MediaKeySystemAccess.prototype.getConfiguration = function(...args) {
    onAPICall("MediaKeySystemAccess.prototype.getConfiguration", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.getConfiguration.push(myObj);
    let mk;
    try {
      mk = savegetConfiguration.apply(this, args);
    } catch (e) {
      spyLogger.error(">> MediaKeySystemAccess.prototype.getConfiguration failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    spyLogger.debug(">> MediaKeySystemAccess.prototype.getConfiguration succeeded:", mk);
    myObj.response = mk;
    myObj.responseDate = Date.now();
    return mk;
  };

  const savesetMediaKeys = HTMLMediaElement.prototype.setMediaKeys;
  HTMLMediaElement.prototype.setMediaKeys = function(...args) {
    onAPICall("HTMLMediaElement.prototype.setMediaKeys", args);
    const myObj = {
      self: this,
      date: Date.now(),
      args,
    };
    EME_CALLS.setMediaKeys.push(myObj);
    let prom;
    try {
      prom = savesetMediaKeys.apply(this, args);
    } catch (e) {
      spyLogger.error(">> HTMLMediaElement.prototype.setMediaKeys failed:", e);
      myObj.error = e;
      myObj.errorDate = Date.now();
      throw e;
    }
    myObj.response = prom;
    myObj.responseDate = Date.now();

    prom.then((r) => {
      spyLogger.debug(">> HTMLMediaElement.prototype.setMediaKeys resolved:", r);
      myObj.responseResolved = r;
      myObj.responseResolvedDate = Date.now();
    }, (e) => {
      spyLogger.error(">> HTMLMediaElement.prototype.setMediaKeys rejected:", e);
      myObj.responseError = e;
      myObj.responseErrorDate = Date.now();
    });
    return prom;
  };

  return {
    restore: function () {
      navigator.requestMediaKeySystemAccess = saveRequestMediaKeySystemAccess;

      MediaKeySession.prototype.update = saveUpdate;
      MediaKeySession.prototype.load = saveload;
      MediaKeySession.prototype.close = saveclose;
      MediaKeySession.prototype.remove = saveremove;
      MediaKeySession.prototype.generateRequest = savegenerateRequest;

      MediaKeys.prototype.createSession = savecreateSession;
      MediaKeys.prototype.setServerCertificate = savesetServerCertificate;
      MediaKeySystemAccess.prototype.createMediaKeys = savecreateMediaKeys;
      MediaKeySystemAccess.prototype.getConfiguration = savegetConfiguration;

      HTMLMediaElement.prototype.setMediaKeys = savesetMediaKeys;
    },
  };
}

window.EME_CALLS = EME_CALLS;
window.spyLogger = spyLogger;
window.spyEME = spyEME;
window.restoreEME = spyEME().restore;
