# EMESpy.js ####################################################################


## Overview ####################################################################

This is a tool to spy on most EME-related browser API calls.

Everytime any of the following API have been triggered, this tool logs the
arguments with which the call was done, and also logs the response when it has
succeeded or failed:
  - ``navigator.requestMediaKeySystemAccess``
  - ``mediaKeySystemAccess.prototype.createMediaKeys``
  - ``mediaKeySystemAccess.prototype.getConfiguration``
  - ``MediaKeySession.prototype.update``
  - ``MediaKeySession.prototype.load``
  - ``MediaKeySession.prototype.remove``
  - ``MediaKeySession.prototype.close``
  - ``MediaKeySession.prototype.generateRequest``
  - ``MediaKeys.prototype.createSession``
  - ``MediaKeys.prototype.setServerCertificate``
  - ``HTMLMediaElement.prototype.setMediaKeys``



## How to use it ###############################################################

To use it, you can import it through npm:
```sh
npm install eme-spy
```

Then use this module as you want.

The API is basically as follow:
```js
import EMESpy from "eme-spy";

// Start spying on EME calls.
// Under default settings, every EME calls will be logged through either
// console.debug, for API calls and responses/resolved promises or through
// console.error for errors/rejected promises.
// The `EME_CALLS` object will also be filled when the spy is active (see
// below).
const stopEMESpy = EMESpy.startEMESpy();

// Stop the created EME spy:
//   - stop logging when EME API are called
//   - stop adding entries to the EME_CALLS
//   - clean up the resources taken
stopEMESpy();

// The EME_CALLS Object contains every details about all the API calls (date at
// which it has been called, context, arguments, response, date of the response,
// errors...) when the spy has been active.
console.log(EMESpy.EME_CALLS);

// You can also declare custom log functions

// For debug calls (when a EME API is called and was resolved/returned
// sucessfully - depending on the type of API)
EMESpy.Logger.debug = function(...args) {
  myPersonalLogger.debug(...args);
}

// For errors and rejected promises from EME APIs
EMESpy.Logger.error = function(...args) {
  myPersonalLogger.error(...args);
}
```

Note: You can also add the script in [dist/bundle.js
](https://github.com/peaBerberian/EMESpy.js/blob/master/src/EMESpy.js) in your
wanted page directly (e.g. via the inspector).
You can then call any function through a `"EME_SPY"` object newly created in
`window`.
