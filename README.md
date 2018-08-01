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
EMESpy.startEMESpy();
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
import MSESpy from "mse-spy";

MSESpy.startMSESpy();
```



## API #########################################################################

The API is basically as follow:
```js
// Start spying on EME calls.
// Under default settings, every EME calls will be logged through either
// console.debug, for API calls and responses/resolved promises or through
// console.error for errors/rejected promises.
// The `EME_CALLS` object will also be filled when the spy is active (see
// below).
const spy = EMESpy.startEMESpy();

// Stop the created EME spy:
//   - stop logging when EME API are called
//   - stop adding entries to the EME_CALLS
//   - clean up the resources taken
spy.restore();

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
