(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.EMESpy = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Store information about every EME Calls stubbed in this file.
   * @type {Object}
   */
  var EME_CALLS = {
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
    update: []
  };

  /**
   * Define the logger for spyEME.
   * Allows to re-define a specific logger on runtime / before applying this
   * script.
   * @type {Object}
   */
  var spyLogger = window.spyLogger || {
    /* eslint-disable no-console */
    log: function log() {
      var _console;

      (_console = console).log.apply(_console, arguments);
    },
    debug: function debug() {
      var _console2;

      (_console2 = console).debug.apply(_console2, arguments);
    },
    info: function info() {
      var _console3;

      (_console3 = console).info.apply(_console3, arguments);
    },
    error: function error() {
      var _console4;

      (_console4 = console).error.apply(_console4, arguments);
    },
    warning: function warning() {
      var _console5;

      (_console5 = console).warning.apply(_console5, arguments);
    }
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
        spyLogger.debug(">>> " + fnName + " called with arguments:", args);
      } else {
        spyLogger.debug(">>> " + fnName + " called");
      }
    }
    var saveRequestMediaKeySystemAccess = navigator.requestMediaKeySystemAccess;
    navigator.requestMediaKeySystemAccess = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      onAPICall("navigator.requestMediaKeySystemAccess", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.requestMediaKeySystemAccess.push(myObj);

      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> navigator.requestMediaKeySystemAccess resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> navigator.requestMediaKeySystemAccess rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var saveUpdate = MediaKeySession.prototype.update;
    MediaKeySession.prototype.update = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      onAPICall("MediaKeySession.prototype.update", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.update.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeySession.prototype.update resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeySession.prototype.update rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var saveload = MediaKeySession.prototype.load;
    MediaKeySession.prototype.load = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      onAPICall("MediaKeySession.prototype.load", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.load.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeySession.prototype.load resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeySession.prototype.load rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var saveremove = MediaKeySession.prototype.remove;
    MediaKeySession.prototype.remove = function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      onAPICall("MediaKeySession.prototype.remove", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.remove.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeySession.prototype.remove resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeySession.prototype.remove rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var saveclose = MediaKeySession.prototype.close;
    MediaKeySession.prototype.close = function () {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      onAPICall("MediaKeySession.prototype.close", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.close.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeySession.prototype.close resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeySession.prototype.close rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var savegenerateRequest = MediaKeySession.prototype.generateRequest;
    MediaKeySession.prototype.generateRequest = function () {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      onAPICall("MediaKeySession.prototype.generateRequest", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.generateRequest.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeySession.prototype.generateRequest resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeySession.prototype.generateRequest rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var savecreateSession = MediaKeys.prototype.createSession;
    MediaKeys.prototype.createSession = function () {
      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      onAPICall("MediaKeys.prototype.createSession", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.createSession.push(myObj);
      var session = void 0;
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

    var savesetServerCertificate = MediaKeys.prototype.setServerCertificate;
    MediaKeys.prototype.setServerCertificate = function () {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      onAPICall("MediaKeys.prototype.setServerCertificate", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.setServerCertificate.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeys.prototype.setServerCertificate resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeys.prototype.setServerCertificate rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var savecreateMediaKeys = MediaKeySystemAccess.prototype.createMediaKeys;
    MediaKeySystemAccess.prototype.createMediaKeys = function () {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      onAPICall("MediaKeySystemAccess.prototype.createMediaKeys", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.createMediaKeys.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> MediaKeySystemAccess.prototype.createMediaKeys resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> MediaKeySystemAccess.prototype.createMediaKeys rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    var savegetConfiguration = MediaKeySystemAccess.prototype.getConfiguration;
    MediaKeySystemAccess.prototype.getConfiguration = function () {
      for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      onAPICall("MediaKeySystemAccess.prototype.getConfiguration", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.getConfiguration.push(myObj);
      var mk = void 0;
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

    var savesetMediaKeys = HTMLMediaElement.prototype.setMediaKeys;
    HTMLMediaElement.prototype.setMediaKeys = function () {
      for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      onAPICall("HTMLMediaElement.prototype.setMediaKeys", args);
      var myObj = {
        self: this,
        date: Date.now(),
        args: args
      };
      EME_CALLS.setMediaKeys.push(myObj);
      var prom = void 0;
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

      prom.then(function (r) {
        spyLogger.debug(">> HTMLMediaElement.prototype.setMediaKeys resolved:", r);
        myObj.responseResolved = r;
        myObj.responseResolvedDate = Date.now();
      }, function (e) {
        spyLogger.error(">> HTMLMediaElement.prototype.setMediaKeys rejected:", e);
        myObj.responseError = e;
        myObj.responseErrorDate = Date.now();
      });
      return prom;
    };

    return {
      restore: function restore() {
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
      }
    };
  }

  exports.EME_CALLS = EME_CALLS;
  exports.spyLogger = spyLogger;
  exports.spyEME = spyEME;
  exports.restoreEME = restoreEME;
  exports.default = spyEME;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
