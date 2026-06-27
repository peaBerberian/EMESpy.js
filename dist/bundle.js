(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EMESpy = {}));
})(this, (function (exports) { 'use strict';

  /**
   * Store information about every EME Calls stubbed in this file.
   * @type {Object}
   */
  var EME_CALLS = {};
  function getEMECalls() {
    return EME_CALLS;
  }
  function resetEMECalls() {
    Object.keys(EME_CALLS).forEach(function (key) {
      delete EME_CALLS[key];
    });
  }
  var currentWindow$1 = typeof window !== "undefined" ? window : {};
  var NativeMediaEncryptedEvent = currentWindow$1.MediaEncryptedEvent;
  var NativeMediaKeyMessageEvent = currentWindow$1.MediaKeyMessageEvent;
  var NativeMediaKeys = currentWindow$1.MediaKeys;
  var NativeMediaKeySession = currentWindow$1.MediaKeySession;
  var NativeMediaKeyStatusMap = currentWindow$1.MediaKeyStatusMap;
  var NativeMediaKeySystemAccess = currentWindow$1.MediaKeySystemAccess;

  var id = 0;

  /**
   * Generate a new number each time it is called.
   * /!\ Never check for an upper-bound. Please do not use if you can reach
   * `Number.MAX_VALUE`
   * @returns {number}
   */
  function generateId() {
    return id++;
  }

  function getPropertyDescriptor(baseObject, propertyName) {
    var currentObject = baseObject;
    while (currentObject != null) {
      var descriptor = Object.getOwnPropertyDescriptor(currentObject, propertyName);
      if (descriptor != null) {
        return {
          descriptor: descriptor,
          owner: currentObject
        };
      }
      currentObject = Object.getPrototypeOf(currentObject);
    }
    return null;
  }

  /**
   * Define the logger for EMESpy.
   * Allows to re-define a specific logger on runtime / before applying this
   * script.
   * @type {Object}
   */
  var currentWindow = typeof window !== "undefined" ? window : {};
  var defaultLogger = {
    /**
     * Triggered each time a property is accessed.
     * @param {string} pathString - human-readable path to the property.
     * @param {*} value - the value it currently has.
     */
    onPropertyAccess: function onPropertyAccess(pathString, value) {
      console.debug(">>> Getting ".concat(pathString, ":"), value);
    },
    /**
     * Triggered each time a property is set.
     * @param {string} pathString - human-readable path to the property.
     * @param {*} value - the value it is set to.
     */
    onSettingProperty: function onSettingProperty(pathString, value) {
      console.debug(">> Setting ".concat(pathString, ":"), value);
    },
    /**
     * Triggered when some object is instanciated (just before).
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {Array.<*>} args - Arguments given to the constructor
     */
    onObjectInstanciation: function onObjectInstanciation(objectName, args) {
      if (args.length) {
        console.debug(">>> Creating ".concat(objectName, " with arguments:"), args);
      } else {
        console.debug(">>> Creating ".concat(objectName));
      }
    },
    /**
     * Triggered when an Object instanciation failed.
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {Error} error - Error thrown by the constructor
     */
    onObjectInstanciationError: function onObjectInstanciationError(objectName, error) {
      console.error(">> ".concat(objectName, " creation failed:"), error);
    },
    /**
     * Triggered when an Object instanciation succeeded.
     * @param {string} objectName - human-readable name for the concerned object.
     * @param {*} value - The corresponding object instanciated.
     */
    onObjectInstanciationSuccess: function onObjectInstanciationSuccess(objectName, value) {
      console.debug(">>> ".concat(objectName, " created:"), value);
    },
    /**
     * Triggered when some method/function is called.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {Array.<*>} args - Arguments given to this function.
     */
    onFunctionCall: function onFunctionCall(pathName, args) {
      if (args.length) {
        console.debug(">>> ".concat(pathName, " called with arguments:"), args);
      } else {
        console.debug(">>> ".concat(pathName, " called"));
      }
    },
    /**
     * Triggered when a function call fails.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {Error} error - Error thrown by the call
     */
    onFunctionCallError: function onFunctionCallError(pathName, error) {
      console.error(">> ".concat(pathName, " failed:"), error);
    },
    /**
     * Triggered when a function call succeeded.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {*} value - The result of the function
     */
    onFunctionCallSuccess: function onFunctionCallSuccess(pathName, value) {
      console.info(">>> ".concat(pathName, " succeeded:"), value);
    },
    /**
     * Triggered when a function returned a Promise and that promise resolved.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {*} value - The value when the function resolved.
     */
    onFunctionPromiseResolve: function onFunctionPromiseResolve(pathName, value) {
      console.info(">>> ".concat(pathName, " resolved:"), value);
    },
    /**
     * Triggered when a function returned a Promise and that promise rejected.
     * @param {string} pathName - human-readable path for the concerned function.
     * @param {*} value - The error when the function's promise rejected.
     */
    onFunctionPromiseReject: function onFunctionPromiseReject(pathName, value) {
      console.error(">>> ".concat(pathName, " rejected:"), value);
    },
    onEventListenerAdd: function onEventListenerAdd(pathName, eventName, listener) {
      console.debug(">>> ".concat(pathName, ".addEventListener(\"").concat(eventName, "\") called:"), listener);
    },
    onEventListenerRemove: function onEventListenerRemove(pathName, eventName, listener) {
      console.debug(">>> ".concat(pathName, ".removeEventListener(\"").concat(eventName, "\") called:"), listener);
    },
    onEvent: function onEvent(pathName, event) {
      console.debug(">>> ".concat(pathName, " event received:"), event);
    }
  };
  var Logger = Object.assign({}, defaultLogger, currentWindow.EMESpyLogger || currentWindow.MSESpyLogger);

  function getEventLog$1(logObject, eventName) {
    if (logObject[eventName] == null) {
      logObject[eventName] = {
        eventHandler: {
          get: [],
          set: [],
          calls: []
        }
      };
    } else if (logObject[eventName].eventHandler == null) {
      logObject[eventName].eventHandler = {
        get: [],
        set: [],
        calls: []
      };
    }
    return logObject[eventName].eventHandler;
  }
  function spyOnEventHandlerProperties(baseObject, eventHandlerNames, humanReadablePath, logObject) {
    if (baseObject == null) {
      console.warn("Cannot spy on ".concat(humanReadablePath, ": object is unavailable"));
      return null;
    }
    var spiedProperties = [];
    var _loop = function _loop() {
      var propertyName = eventHandlerNames[i];
      var descriptorInfo = getPropertyDescriptor(baseObject, propertyName);
      var completePath = "".concat(humanReadablePath, ".").concat(propertyName);
      var eventName = propertyName.startsWith("on") ? propertyName.slice(2) : propertyName;
      var originalHandlers = new WeakMap();
      if (descriptorInfo == null || descriptorInfo.descriptor.get == null || descriptorInfo.descriptor.set == null) {
        console.warn("No descriptor for event handler property ".concat(completePath));
        return 1; // continue
      }
      var baseDescriptor = descriptorInfo.descriptor;
      Object.defineProperty(baseObject, propertyName, {
        configurable: true,
        enumerable: baseDescriptor.enumerable,
        get: function get() {
          var value = baseDescriptor.get.call(this);
          var originalValue = originalHandlers.get(value) || value;
          Logger.onPropertyAccess(completePath, originalValue);
          getEventLog$1(logObject, eventName).get.push({
            self: this,
            id: generateId(),
            date: Date.now(),
            value: originalValue
          });
          return originalValue;
        },
        set: function set(value) {
          Logger.onSettingProperty(completePath, value);
          getEventLog$1(logObject, eventName).set.push({
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          });
          if (typeof value !== "function") {
            baseDescriptor.set.call(this, value);
            return;
          }
          var wrappedHandler = function emeSpyEventHandler(event) {
            Logger.onEvent(completePath, event);
            getEventLog$1(logObject, eventName).calls.push({
              self: this,
              id: generateId(),
              date: Date.now(),
              event: event,
              listener: value
            });
            return value.call(this, event);
          };
          originalHandlers.set(wrappedHandler, value);
          baseDescriptor.set.call(this, wrappedHandler);
        }
      });
      spiedProperties.push({
        descriptor: baseDescriptor,
        owner: descriptorInfo.owner,
        propertyName: propertyName
      });
    };
    for (var i = 0; i < eventHandlerNames.length; i++) {
      if (_loop()) continue;
    }
    return function stopSpyingOnEventHandlerProperties() {
      for (var _i = 0; _i < spiedProperties.length; _i++) {
        var spiedProperty = spiedProperties[_i];
        if (spiedProperty.owner === baseObject) {
          Object.defineProperty(baseObject, spiedProperty.propertyName, spiedProperty.descriptor);
        } else {
          delete baseObject[spiedProperty.propertyName];
        }
      }
    };
  }

  function _construct(t, e, r) {
    if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
    var o = [null];
    o.push.apply(o, e);
    var p = new (t.bind.apply(t, o))();
    return p;
  }
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (t) {}
    return (_isNativeReflectConstruct = function () {
      return !!t;
    })();
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  function getEventLog(logObject, eventName) {
    if (logObject[eventName] == null) {
      logObject[eventName] = {
        addEventListener: [],
        removeEventListener: [],
        listenerCalls: []
      };
    }
    return logObject[eventName];
  }
  function getListenerKey(eventName, options) {
    var capture = typeof options === "boolean" ? options : (options === null || options === void 0 ? void 0 : options.capture) === true;
    return "".concat(eventName, ":").concat(capture);
  }
  function getListenerRecord(listenerMap, eventName, listener) {
    if (typeof listener !== "function" && (_typeof(listener) !== "object" || listener === null)) {
      return undefined;
    }
    var eventMap = listenerMap.get(listener);
    return eventMap == null ? undefined : eventMap.get(eventName);
  }
  function deleteListenerRecord(listenerMap, eventName, listener) {
    if (typeof listener !== "function" && (_typeof(listener) !== "object" || listener === null)) {
      return;
    }
    var eventMap = listenerMap.get(listener);
    if (eventMap != null) {
      eventMap["delete"](eventName);
    }
  }
  function setListenerRecord(listenerMap, eventName, listener, listenerRecord) {
    if (typeof listener !== "function" && (_typeof(listener) !== "object" || listener === null)) {
      return;
    }
    var eventMap = listenerMap.get(listener);
    if (eventMap == null) {
      eventMap = new Map();
      listenerMap.set(listener, eventMap);
    }
    eventMap.set(eventName, listenerRecord);
  }
  function getAbortSignal(options) {
    return _typeof(options) === "object" && options !== null ? options.signal : undefined;
  }
  function shouldRunOnce(options) {
    return _typeof(options) === "object" && options !== null && options.once === true;
  }
  function spyOnEventTarget(baseObject, eventNames, humanReadablePath, logObject) {
    if (baseObject == null) {
      console.warn("Cannot spy on ".concat(humanReadablePath, ": object is unavailable"));
      return null;
    }
    var oldAddEventListener = baseObject.addEventListener;
    var oldRemoveEventListener = baseObject.removeEventListener;
    var listenerMap = new WeakMap();
    if (oldAddEventListener == null || oldRemoveEventListener == null) {
      console.warn("Cannot spy on ".concat(humanReadablePath, ": EventTarget unavailable"));
      return null;
    }
    baseObject.addEventListener = function addEventListener(type, listener, options) {
      if (!eventNames.includes(type) || typeof listener !== "function" && (_typeof(listener) !== "object" || listener === null)) {
        return oldAddEventListener.call(this, type, listener, options);
      }
      Logger.onEventListenerAdd(humanReadablePath, type, listener);
      getEventLog(logObject, type).addEventListener.push({
        self: this,
        id: generateId(),
        date: Date.now(),
        type: type,
        listener: listener,
        options: options
      });
      var listenerKey = getListenerKey(type, options);
      var existingRecord = getListenerRecord(listenerMap, listenerKey, listener);
      if (existingRecord != null) {
        return oldAddEventListener.call(this, type, existingRecord.wrappedListener, options);
      }
      var signal = getAbortSignal(options);
      var runOnce = shouldRunOnce(options);
      var listenerRecord;
      var wrappedListener = function emeSpyEventListener(event) {
        if (runOnce) {
          var _listenerRecord;
          deleteListenerRecord(listenerMap, listenerKey, listener);
          if (((_listenerRecord = listenerRecord) === null || _listenerRecord === void 0 ? void 0 : _listenerRecord.abortHandler) != null) {
            signal === null || signal === void 0 || signal.removeEventListener("abort", listenerRecord.abortHandler);
          }
        }
        Logger.onEvent("".concat(humanReadablePath, ".").concat(type), event);
        getEventLog(logObject, type).listenerCalls.push({
          self: this,
          id: generateId(),
          date: Date.now(),
          event: event,
          listener: listener
        });
        if (typeof listener === "function") {
          return listener.call(this, event);
        }
        return listener.handleEvent(event);
      };
      listenerRecord = {
        abortHandler: undefined,
        signal: signal,
        wrappedListener: wrappedListener
      };
      if ((signal === null || signal === void 0 ? void 0 : signal.aborted) === true) {
        return oldAddEventListener.call(this, type, wrappedListener, options);
      }
      if (signal != null) {
        listenerRecord.abortHandler = function onAbort() {
          deleteListenerRecord(listenerMap, listenerKey, listener);
        };
        signal.addEventListener("abort", listenerRecord.abortHandler, {
          once: true
        });
      }
      setListenerRecord(listenerMap, listenerKey, listener, listenerRecord);
      return oldAddEventListener.call(this, type, wrappedListener, options);
    };
    baseObject.removeEventListener = function removeEventListener(type, listener, options) {
      var listenerKey = getListenerKey(type, options);
      var listenerRecord = getListenerRecord(listenerMap, listenerKey, listener);
      if (!eventNames.includes(type) || listener == null || listenerRecord == null) {
        return oldRemoveEventListener.call(this, type, listener, options);
      }
      Logger.onEventListenerRemove(humanReadablePath, type, listener);
      getEventLog(logObject, type).removeEventListener.push({
        self: this,
        id: generateId(),
        date: Date.now(),
        type: type,
        listener: listener,
        options: options
      });
      deleteListenerRecord(listenerMap, listenerKey, listener);
      if (listenerRecord.abortHandler != null) {
        var _listenerRecord$signa;
        (_listenerRecord$signa = listenerRecord.signal) === null || _listenerRecord$signa === void 0 || _listenerRecord$signa.removeEventListener("abort", listenerRecord.abortHandler);
      }
      return oldRemoveEventListener.call(this, type, listenerRecord.wrappedListener, options);
    };
    return function stopSpyingOnEventTarget() {
      baseObject.addEventListener = oldAddEventListener;
      baseObject.removeEventListener = oldRemoveEventListener;
    };
  }

  /**
   * Log multiple method calls for an object.
   * Also populates an object with multiple data at the time of the call.
   *
   * @param {Object} baseObject - Object in which the method/function is.
   * For example to spy on the Date method `toLocaleDateString`, you will have to
   * set here `Date.prototype`.
   * @param {Array.<string>} methodNames - Every methods you want to spy on
   * @param {string} humanReadablePath - Path to the method. Used for logging
   * purposes.
   * For example `"Date.prototype"`, for spies of Date's methods.
   * @param {Object} logObject - Object where infos about the method calls will be
   * added.
   * The methods' name will be the key of the object.
   *
   * The values will be an array of object with the following properties:
   *
   *   - self {Object}: Reference to the baseObject argument.
   *
   *   - id {number}: a uniquely generated ascending ID for any stubbed
   *    property/methods with this library.
   *
   *   - date {number}: Timestamp at the time of the call.
   *
   *   - args {Array}: Array of arguments given to the function
   *
   *   - response {*}: Response of the function.
   *     The property is not defined if the function did not respond yet or was on
   *     error.
   *
   *   - responseDate {number}: Timestamp at the time of the response.
   *     The property is not defined if the function did not respond yet or was on
   *     error.
   *
   *   - error {*}: Error thrown by the function, if one.
   *     The property is not defined if the function did not throw.
   *
   *   - errorDate {number} Timestamp at the time of the error.
   *     The property is not defined if the function did not throw.
   *
   *   - responseResolved {*}: When the returned value (the response) is a promise
   *     and that promise resolved, this property contains the value emitted by
   *     the resolve. Else, that property is not set.
   *
   *   - responseResolvedDate {number}: When the returned value (the response) is
   *     a promise and that promise resolved, this property contains the date at
   *     which the promise resolved. Else, that property is not set.
   *
   *   - responseRejected {*}: When the returned value (the response) is a promise
   *     and that promise rejected, this property contains the error emitted by
   *     the reject. Else, that property is not set.
   *
   *   - responseRejectedDate {number}: When the returned value (the response) is
   *     a promise and that promise rejected, this property contains the date at
   *     which the promise rejected. Else, that property is not set.
   *
   * @returns {Function} - function which deactivates the spy when called.
   */
  function spyOnMethods(baseObject, methodNames, humanReadablePath, logObject) {
    if (baseObject == null) {
      console.warn("Cannot spy on ".concat(humanReadablePath, ": object is unavailable"));
      return null;
    }
    var baseObjectMethods = methodNames.reduce(function (acc, methodName) {
      acc[methodName] = baseObject[methodName];
      return acc;
    }, {});
    var _loop = function _loop() {
      var methodName = methodNames[i];
      var methodLabel = _typeof(methodName) === "symbol" ? methodName.toString() : methodName;
      var completePath = "".concat(humanReadablePath, ".").concat(methodLabel);
      var oldMethod = baseObject[methodName];
      if (!oldMethod) {
        console.warn("No method in ".concat(completePath));
        return 1; // continue
      }
      baseObject[methodName] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        Logger.onFunctionCall(completePath, args);
        var currentLogObject = {
          self: this,
          id: generateId(),
          date: Date.now(),
          args: args
        };
        if (!logObject[methodName]) {
          logObject[methodName] = [];
        }
        logObject[methodName].push(currentLogObject);
        var res;
        try {
          res = oldMethod.apply(this, args);
        } catch (e) {
          Logger.onFunctionCallError(completePath, e);
          currentLogObject.error = e;
          currentLogObject.errorDate = Date.now();
          throw e;
        }
        Logger.onFunctionCallSuccess(completePath, res);
        currentLogObject.response = res;
        currentLogObject.responseDate = Date.now();
        if (res instanceof Promise) {
          res.then(
          // on success
          function (value) {
            Logger.onFunctionPromiseResolve(completePath, value);
            currentLogObject.responseResolved = value;
            currentLogObject.responseResolvedDate = Date.now();
          },
          // on error
          function (err) {
            Logger.onFunctionPromiseReject(completePath, err);
            currentLogObject.responseRejected = err;
            currentLogObject.responseRejectedDate = Date.now();
          });
        }
        return res;
      };
    };
    for (var i = 0; i < methodNames.length; i++) {
      if (_loop()) continue;
    }
    return function stopSpyingOnMethods() {
      for (var _i = 0; _i < methodNames.length; _i++) {
        var methodName = methodNames[_i];
        baseObject[methodName] = baseObjectMethods[methodName];
      }
    };
  }

  /**
   * Spy access and updates of an Object's read-only properties:
   *   - log every access/updates
   *   - add entries in a logging object
   *
   * @param {Object} baseObject - Object in which the property is.
   * For example to spy on the HTMLMediaElement property `currentTime`, you will
   * have to set here `HTMLMediaElement.prototype`.
   * @param {Object} baseDescriptors - Descriptors for the spied properties.
   * The keys are the properties' names, the values are the properties'
   * descriptors.
   * @param {Array.<string>} propertyNames - Every properties you want to spy on.
   * @param {string} humanReadablePath - Path to the property. Used for logging
   * purposes.
   * For example `"HTMLMediaElement.prototype"`, for spies of HTMLMediaElement's
   * class properties.
   * @param {Object} logObject - Object where infos about the properties access
   * will be added.
   * The methods' name will be the key of the object.
   *
   * The values will be an object with a single key ``get``, corresponding to
   * property accesses
   *
   * This key will then have as value an array of object.
   *
   *  - self {Object}: Reference to the baseObject argument.
   *
   *  - id {number}: a uniquely generated ID for any stubbed property/methods with
   *    this library.
   *
   *  - date {number}: Timestamp at the time of the property access.
   *
   *  - value {*}: value of the property at the time of access.
   *
   * @returns {Function} - function which deactivates the spy when called.
   */
  function spyOnReadOnlyProperties(baseObject, baseDescriptors, propertyNames, humanReadablePath, logObject) {
    var _loop = function _loop() {
      var propertyName = propertyNames[i];
      var baseDescriptor = baseDescriptors[propertyName];
      var completePath = "".concat(humanReadablePath, ".").concat(propertyName);
      if (!baseDescriptor) {
        console.warn("No descriptor for property ".concat(completePath));
        return 1; // continue
      }
      Object.defineProperty(baseObject, propertyName, {
        get: function get() {
          var value = baseDescriptor.get.bind(this)();
          Logger.onPropertyAccess(completePath, value);
          var currentLogObject = {
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          };
          if (!logObject[propertyName]) {
            logObject[propertyName] = {
              get: []
            };
          }
          logObject[propertyName].get.push(currentLogObject);
          return value;
        }
      });
    };
    for (var i = 0; i < propertyNames.length; i++) {
      if (_loop()) continue;
    }
    return function stopSpyingOnReadOnlyProperties() {
      Object.defineProperties(baseObject, propertyNames.reduce(function (acc, propertyName) {
        acc[propertyName] = baseDescriptors[propertyName];
        return acc;
      }, {}));
    };
  }

  function spyOnHTMLMediaElement() {
    if (typeof HTMLMediaElement === "undefined") {
      console.warn("Cannot spy on HTMLMediaElement: native object is unavailable");
      return null;
    }
    if (EME_CALLS.HTMLMediaElement == null) {
      EME_CALLS.HTMLMediaElement = {
        properties: {},
        eventListeners: {}
      };
    }
    var htmlMediaElementDescriptors = Object.getOwnPropertyDescriptors(HTMLMediaElement.prototype);
    var resetMethods = spyOnMethods(HTMLMediaElement.prototype, ["setMediaKeys"], "HTMLMediaElement.prototype", EME_CALLS);
    var resetReadOnlyProperties = spyOnReadOnlyProperties(HTMLMediaElement.prototype, htmlMediaElementDescriptors, ["mediaKeys"], "HTMLMediaElement.prototype", EME_CALLS.HTMLMediaElement.properties);
    var resetEventHandlers = spyOnEventHandlerProperties(HTMLMediaElement.prototype, ["onencrypted", "onwaitingforkey"], "HTMLMediaElement.prototype", EME_CALLS.HTMLMediaElement.eventListeners);
    var resetEventTarget = spyOnEventTarget(HTMLMediaElement.prototype, ["encrypted", "waitingforkey"], "HTMLMediaElement.prototype", EME_CALLS.HTMLMediaElement.eventListeners);
    return function stopSpyingOnHTMLMediaElement() {
      resetEventTarget && resetEventTarget();
      resetEventHandlers && resetEventHandlers();
      resetReadOnlyProperties && resetReadOnlyProperties();
      resetMethods && resetMethods();
    };
  }

  /**
   * Spy access and updates of an Object's read & write properties:
   *   - log every access/updates
   *   - add entries in a logging object
   *
   * @param {Object} baseObject - Object in which the property is.
   * For example to spy on the HTMLMediaElement property `currentTime`, you will
   * have to set here `HTMLMediaElement.prototype`.
   * @param {Object} baseDescriptors - Descriptors for the spied properties.
   * The keys are the properties' names, the values are the properties'
   * descriptors.
   * @param {Array.<string>} propertyNames - Every properties you want to spy on.
   * @param {string} humanReadablePath - Path to the property. Used for logging
   * purposes.
   * For example `"HTMLMediaElement.prototype"`, for spies of HTMLMediaElement's
   * class properties.
   * @param {Object} logObject - Object where infos about the properties access
   * will be added.
   * The methods' name will be the key of the object.
   *
   * The values will be an object with two keys ``get`` and ``set``, respectively
   * for property accesses and property updates.
   *
   * Each one of those properties will then have as values an array of object.
   * Those objects are under the following form:
   *
   *  1. for `get` (property access):
   *
   *   - self {Object}: Reference to the baseObject argument.
   *
   *  - id {number}: a uniquely generated ascending ID for any stubbed
   *    property/methods with this library.
   *
   *   - date {number}: Timestamp at the time of the property access.
   *
   *   - value {*}: value of the property at the time of access.
   *
   *
   *  2. for `set` (property updates):
   *
   *   - self {Object}: Reference to the baseObject argument.
   *
   *  - id {number}: a uniquely generated ascending ID for any stubbed
   *    property/methods with this library.
   *
   *   - date {number}: Timestamp at the time of the property update.
   *
   *   - value {*}: new value the property is set to
   *
   * @returns {Function} - function which deactivates the spy when called.
   */
  function spyOnProperties(baseObject, baseDescriptors, propertyNames, humanReadablePath, logObject) {
    var _loop = function _loop() {
      var propertyName = propertyNames[i];
      var baseDescriptor = baseDescriptors[propertyName];
      var completePath = "".concat(humanReadablePath, ".").concat(propertyName);
      if (!baseDescriptor) {
        console.warn("No descriptor for property ".concat(completePath));
        return 1; // continue
      }
      Object.defineProperty(baseObject, propertyName, {
        get: function get() {
          var value = baseDescriptor.get.bind(this)();
          Logger.onPropertyAccess(completePath, value);
          var currentLogObject = {
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          };
          if (!logObject[propertyName]) {
            logObject[propertyName] = {
              set: [],
              get: []
            };
          }
          logObject[propertyName].get.push(currentLogObject);
          return value;
        },
        set: function set(value) {
          Logger.onSettingProperty(completePath, value);
          var currentLogObject = {
            self: this,
            id: generateId(),
            date: Date.now(),
            value: value
          };
          if (!logObject[propertyName]) {
            logObject[propertyName] = {
              set: [],
              get: []
            };
          }
          logObject[propertyName].set.push(currentLogObject);
          baseDescriptor.set.bind(this)(value);
        }
      });
    };
    for (var i = 0; i < propertyNames.length; i++) {
      if (_loop()) continue;
    }
    return function stopSpyingOnProperties() {
      Object.defineProperties(baseObject, propertyNames.reduce(function (acc, propertyName) {
        acc[propertyName] = baseDescriptors[propertyName];
        return acc;
      }, {}));
    };
  }

  function spyOnWholeObject(BaseObject, objectName, readOnlyPropertyNames, propertyNames, staticMethodNames, methodNames, loggingObject) {
    if (BaseObject == null || !BaseObject.prototype) {
      console.warn("Cannot spy on ".concat(objectName, ": native object is unavailable"));
      return null;
    }
    if (loggingObject[objectName] == null) {
      loggingObject[objectName] = {
        "new": [],
        methods: {},
        staticMethods: {},
        properties: {},
        eventListeners: {}
      };
    }
    function StubbedObject() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      Logger.onObjectInstanciation(objectName, args);
      var now = Date.now();
      var spyObj = {
        date: now,
        args: args
      };
      loggingObject[objectName]["new"].push(spyObj);
      var baseObject;
      try {
        baseObject = _construct(BaseObject, args);
      } catch (e) {
        Logger.onObjectInstanciationError(objectName, e);
        spyObj.error = e;
        spyObj.errorDate = Date.now();
        throw e;
      }
      Logger.onObjectInstanciationSuccess(objectName, baseObject);
      spyObj.response = baseObject;
      spyObj.responseDate = Date.now();
      return baseObject;
    }
    StubbedObject.prototype = BaseObject.prototype;
    if (Object.setPrototypeOf) {
      try {
        Object.setPrototypeOf(StubbedObject, BaseObject);
      } catch (e) {
        console.warn("Cannot copy ".concat(objectName, "'s static prototype"), e);
      }
    }
    var unspyStaticMethods = spyOnMethods(BaseObject, staticMethodNames, objectName, loggingObject[objectName].staticMethods);
    staticMethodNames.forEach(function (method) {
      StubbedObject[method] = BaseObject[method].bind(BaseObject);
    });
    var BaseObjectProtoDescriptors = Object.getOwnPropertyDescriptors(BaseObject.prototype);
    var unspyReadOnlyProps = spyOnReadOnlyProperties(BaseObject.prototype, BaseObjectProtoDescriptors, readOnlyPropertyNames, "".concat(objectName, ".prototype"), loggingObject[objectName].properties);
    var unspyProps = spyOnProperties(BaseObject.prototype, BaseObjectProtoDescriptors, propertyNames, "".concat(objectName, ".prototype"), loggingObject[objectName].properties);
    var unspyMethods = spyOnMethods(BaseObject.prototype, methodNames, "".concat(objectName, ".prototype"), loggingObject[objectName].methods);
    window[objectName] = StubbedObject;
    return function stopSpying() {
      unspyReadOnlyProps();
      unspyProps();
      unspyStaticMethods();
      unspyMethods();
      window[objectName] = BaseObject;
    };
  }

  function spyOnMediaEncryptedEvent() {
    return spyOnWholeObject(
    // Object to spy on
    NativeMediaEncryptedEvent,
    // name in window
    "MediaEncryptedEvent",
    // read-only properties
    ["initDataType", "initData"],
    // regular properties
    [],
    // static methods
    [],
    // methods
    [],
    // global logging object
    EME_CALLS);
  }

  function spyOnMediaKeyMessageEvent() {
    return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeyMessageEvent,
    // name in window
    "MediaKeyMessageEvent",
    // read-only properties
    ["messageType", "message"],
    // regular properties
    [],
    // static methods
    [],
    // methods
    [],
    // global logging object
    EME_CALLS);
  }

  function spyOnMediaKeySession() {
    var resetWholeObject = spyOnWholeObject(
    // Object to spy on
    NativeMediaKeySession,
    // name in window
    "MediaKeySession",
    // read-only properties
    ["sessionId", "expiration", "closed", "keyStatuses"],
    // regular properties
    [],
    // static methods
    [],
    // methods
    ["generateRequest", "load", "update", "close", "remove"],
    // global logging object
    EME_CALLS);
    if (NativeMediaKeySession == null || NativeMediaKeySession.prototype == null) {
      return resetWholeObject;
    }
    if (EME_CALLS.MediaKeySession == null) {
      EME_CALLS.MediaKeySession = {
        "new": [],
        methods: {},
        staticMethods: {},
        properties: {},
        eventListeners: {}
      };
    }
    var resetEventHandlers = spyOnEventHandlerProperties(NativeMediaKeySession.prototype, ["onmessage", "onkeystatuseschange"], "MediaKeySession.prototype", EME_CALLS.MediaKeySession.eventListeners);
    var resetEventTarget = spyOnEventTarget(NativeMediaKeySession.prototype, ["message", "keystatuseschange"], "MediaKeySession.prototype", EME_CALLS.MediaKeySession.eventListeners);
    return function stopSpyingOnMediaKeySession() {
      resetEventTarget && resetEventTarget();
      resetEventHandlers && resetEventHandlers();
      resetWholeObject && resetWholeObject();
    };
  }

  function spyOnMediaKeyStatusMap() {
    return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeyStatusMap,
    // name in window
    "MediaKeyStatusMap",
    // read-only properties
    ["size"],
    // regular properties
    [],
    // static methods
    [],
    // methods
    ["get", "has", "entries", "keys", "values", "forEach", Symbol.iterator],
    // global logging object
    EME_CALLS);
  }

  function spyOnMediaKeySystemAccess() {
    return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeySystemAccess,
    // name in window
    "MediaKeySystemAccess",
    // read-only properties
    ["keySystem"],
    // regular properties
    [],
    // static methods
    [],
    // methods
    ["getConfiguration", "createMediaKeys"],
    // global logging object
    EME_CALLS);
  }

  function spyOnMediaKeys() {
    return spyOnWholeObject(
    // Object to spy on
    NativeMediaKeys,
    // name in window
    "MediaKeys",
    // read-only properties
    [],
    // regular properties
    [],
    // static methods
    [],
    // methods
    ["createSession", "getStatusForPolicy", "setServerCertificate"],
    // global logging object
    EME_CALLS);
  }

  function spyOnRequestMediaKeySystemAccess() {
    return spyOnMethods(navigator, ["requestMediaKeySystemAccess"], "navigator", EME_CALLS);
  }

  var resetSpies = null;

  /**
   * Start/restart spying on EME API calls.
   */
  function start() {
    if (resetSpies != null) {
      resetSpies();
    }
    var resetSpyFunctions = [spyOnMediaKeys(), spyOnMediaKeyStatusMap(), spyOnMediaKeySession(), spyOnMediaKeySystemAccess(), spyOnMediaEncryptedEvent(), spyOnMediaKeyMessageEvent(), spyOnRequestMediaKeySystemAccess(), spyOnHTMLMediaElement()].filter(function (cb) {
      return cb;
    });
    resetSpies = function resetEverySpies() {
      resetSpyFunctions.forEach(function (fn) {
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

  exports.Logger = Logger;
  exports.getEMECalls = getEMECalls;
  exports.resetEMECalls = resetEMECalls;
  exports.start = start;
  exports.stop = stop;

}));
