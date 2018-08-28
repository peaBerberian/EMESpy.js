# EMESpy.js ####################################################################


## Overview ####################################################################

This is a tool to spy on most EME-related browser API calls. It mainly has been
used for debugging and reverse-engineering purposes on media-oriented
web-applications.

It logs and registers when any of the following methods are called:
  - ``navigator.requestMediaKeySystemAccess``
  - ``mediaKeySystemAccess.prototype.createMediaKeys``
  - ``mediaKeySystemAccess.prototype.getConfiguration``
  - ``MediaKeySession.prototype.generateRequest``
  - ``MediaKeySession.prototype.load``
  - ``MediaKeySession.prototype.update``
  - ``MediaKeySession.prototype.close``
  - ``MediaKeySession.prototype.remove``
  - ``MediaKeys.prototype.createSession``
  - ``MediaKeys.prototype.setServerCertificate``
  - ``HTMLMediaElement.prototype.setMediaKeys``

It also logs when the following properties are accessed:
  - ``MediaKeySystemAccess.prototype.keySystem``
  - ``MediaKeySession.prototype.sessionId``
  - ``MediaKeySession.prototype.expiration``
  - ``MediaKeySession.prototype.closed``
  - ``MediaKeySession.prototype.keyStatuses``

The registered data is:

  - the date at which the API has been called or the property as been interacted
    with

  - the returned value for an API call or a property access

  - the argument(s) for API calls

  - the value set on properties

  - the context (``this``) at the time of the call

  - the error if the API call threw

  - the resolved data if a method returned a promise and succeeded, with the
    time of this response

  - the error returned if a method returned a promise and failed, with the time
    of this response

It can then be used to produced useful reports on how those APIs are exploited
by any application.



## How to install it ###########################################################

### Including the script directly ##############################################

Because this is mainly a debugging application, the most straightforward way of
using it is just to copy the code of the [compiled bundle
](https://raw.githubusercontent.com/peaBerberian/EMESpy.js/master/dist/bundle.js)
directly, and to copy-paste it into your console.

You will then have a global ``EMESpy`` object, through which you can call any
API defined here.

Example:
```js
// Start the spy
EMESpy.start();

// Get the global EMECalls object registering every calls
// (More informations on it in the concerned chapter)
const EMECalls = EMESpy.getEMECalls();
```

This configuration can also be useful by including this script automatically in
multimedia pages. This can be done through userscript managers, such as
[Tampermonkey for Chrome
](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
or [Greasemonkey for Firefox
](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).


### Adding as a dependency #####################################################

You can also add this module as a dependency through npm:
```sh
npm install eme-spy
```

Then use this module as you want.

```js
import EMESpy from "eme-spy";

EMESpy.start();
```



## API #########################################################################

The API is basically as follow:
```js
// Start spying on the EME APIs:
//   - Will log when those APIs are called or properties are accessed
//   - will add entries to the global EMECalls object.
EMESpy.start();

// Get the global EMECalls object.
// This Object contains every details about all the API calls (date at
// which it has been called, context, arguments, response, date of the response,
// errors...) when the spy has been active.
// (More informations on it in the concerned chapter)
console.log(EMESpy.getEMECalls());

// Reset the global EMECalls object as if no API were called.
console.log(EMESpy.resetEMECalls());

// Stop spying on EME APIs:
//   - stop logging when EME API are called
//   - stop logging when EME properties are set/accessed
//   - stop adding entries to the global EMECalls object.
//   - clean up the resources taken
EMESpy.stop();

// Spy again (after deactivating it)
EMESpy.start();

// You can also declare custom log functions
// (More informations on it in the concerned chapter)
EMESpy.Logger.onPropertyAccess = CustomLogger;
```


### EMECalls object ############################################################

The EMECalls object contains information about every call performed while the
spy was active.

It can be obtained by calling the ``EMESpy.getEMECalls()`` API.

Here is its basic structure:
```js
// EME Calls object
{
  MediaKeySession: { // Data about the MediaKeySession native object

    methods: {
      generateRequest: [ // Name of the method concerned
        {
          self: mediaKeySession, // {Object} The value of `this` at the time of the
                                 // call (usually the MediaKeySession)
          id: 4, // {number} unique id, generated in ascending order for any
                 // entry.
                 // Generated here at the time of the call.
          date: 1533722155401, // {number} timestamp at which the call was made
          args: ["cenc", ArrayBuffer], // {Array} Eventual arguments this
                                       // method has been called with


          // If the call succeeded:
          response: Promise<>, // {*} What has been returned by the call
          responseDate: 1533722155401, // {number|undefined} timestamp at which
                                       // the response was received

          // If the call has trown
          error: someError, // {Error|undefined} If an error was thrown while
                            // calling the method.
                            // If this property is set, we won't have `response`
                            // nor `responseDate` set
          errorDate: 1533722155401, // {number|undefined} timestamp at which
                                    // the error was received

          responseResolved: undefined, // {*} When the returned value (the
                                       // response) is a promise and that promise
                                       // resolved, this property contains the
                                       // value emitted by the resolve.
                                       // Else, that property is not set.

          responseResolvedDate: 1533722155410, // {number|undefined} When the
                                               // returned value (the response)
                                               // is a promise and that promise
                                               // resolved, this property
                                               // contains the date at which the
                                               // promise resolved.
                                               // Else, that property is not
                                               // set.

          responseRejected: undefined, // {*} When the returned value (the
                                       // response) is a promise and that promise
                                       // rejected, this property contains the
                                       // error emitted by the reject.
                                       // Else, that property is not set.

          responseRejectedDate: 1533722155410, // {number|undefined} When the
                                               // returned value (the response)
                                               // is a promise and that promise
                                               // rejected, this property
                                               // contains the date at which the
                                               // promise rejected.
                                               // Else, that property is not
                                               // set.
        }
      ]
    },

    properties: {
      sessionId: { // name of the property
        get: [ // A new entry is added each time the property is accessed
          {
            self: mediaKeySession, // {MediaKeySession} The instance of the concerned
                                   // MediaKeySession
            id: 3, // {number} unique id, generated in ascending order for any
                   // entry.
                   // Generated here at the time of the access.
            date: 1533722155401, // {number} timestamp at which the property
                                 // was accessed
            value: 10 // {*} Content of the property as it was accessed
          }
        ],
      }
    }

    new: [  // An entry is added each time a MediaKeySession is created.
            // Empty array by default.
            // Note: MediaKeySession are usually created through
            // MediaKeys.prototype.createSession and not threw the `new`
            // keyword. As such, this array might always stay empty.
      {
        id: 1, // {number} unique id, generated in ascending order for any
               // entry.
               // Generated here at the time of MediaKeySession creation.
        date: 1533722155401, // {number} timestamp at which the call was made
        args: [], // {Array} Eventual arguments the constructor has been called
                  // with

        // If the call succeeded:
        response: mediaKeySession, // {MediaKeySession|undefined}
                                   // MediaKeySession created
        responseDate: 1533722155401, // {number|undefined} timestamp at which
                                     // the response was received

        // If the call has trown
        error: someError, // {Error|undefined} If an error was thrown while
                          // creating a new MediaKeySession.
                          // If this property is set, we won't have `response`
                          // nor `responseDate` set
        errorDate: 1533722155401 // {number|undefined} timestamp at which
                                 // the error was received
      }
    ],
  },

  MediaKeys: { // MediaKeys follows the same structure
    new: [],
    methods: {},
    properties: {},
  },

  MediaKeySystemAccess: { // MediaKeySystemAccess follows the same structure
    new: [],
    methods: {},
    properties: {},
  },

  requestMediaKeySystemAccess: [ // requestMediaKeySystem access respects the
                                 // "methods" interface of the other objects
    {
        self: navigator,
        id: 0,
        date: 1533722155017,
        args: [Object],
        response: Promise<>,
        responseDate: 1533722155401,
        responseResolved: mediaKeySystemAccess,
        responseResolvedDate: 1533722155410,
    }

  setMediaKeys: [ // setMediaKeys access respects the "methods" interface of the
                  // other objects
    {
        self: htmlMediaElement,
        id: 12,
        date: 1533722155676,
        args: [mediaKeys],
        response: Promise<>,
        responseDate: 1533722155401,
        responseResolved: undefined,
        responseResolvedDate: 1533722155410,
    }
  ],
}
```


### Custom Logger ##############################################################

If you don't like the default logging strategy or find it too verbose, a custom
Logger can be defined.

It is accessible through the ``EMESpy.Logger`` object. All it contains are
several functions automatically called at various key points:

```js
Logger = {
  /**
   * Triggered each time a property is accessed.
   * @param {string} pathString - human-readable path to the property.
   * @param {*} value - the value it currently has.
   */
  onPropertyAccess(pathString, value) {},

  /**
   * Triggered each time a property is set.
   * @param {string} pathString - human-readable path to the property.
   * @param {*} value - the value it is set to.
   */
  onSettingProperty(pathString, value) {},

  /**
   * Triggered when some object is instanciated (just before).
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {Array.<*>} args - Arguments given to the constructor
   */
  onObjectInstanciation(objectName, args) {},

  /**
   * Triggered when an Object instanciation failed.
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {Error} error - Error thrown by the constructor
   */
  onObjectInstanciationError(objectName, error) {},

  /**
   * Triggered when an Object instanciation succeeded.
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {*} value - The corresponding object instanciated.
   */
  onObjectInstanciationSuccess(objectName, value) {},

  /**
   * Triggered when some method/function is called.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {Array.<*>} args - Arguments given to this function.
   */
  onFunctionCall(pathName, args) {},

  /**
   * Triggered when a function call fails.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {Error} error - Error thrown by the call
   */
  onFunctionCallError(pathName, error) {},

  /**
   * Triggered when a function call succeeded.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The result of the function
   */
  onFunctionCallSuccess(pathName, value) {},

  /**
   * Triggered when a function returned a Promise and that promise resolved.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The value when the function resolved.
   */
  onFunctionPromiseResolve(pathName, value) {},

  /**
   * Triggered when a function returned a Promise and that promise rejected.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The error when the function's promise rejected.
   */
  onFunctionPromiseReject(pathName, value) {},
};
```

Note: if the code above were to be implemented, you wouldn't have any logs
displaying in the console, as all functions declared here are empty.
You can look at ``src/utils/logger.js`` for default implementations.
