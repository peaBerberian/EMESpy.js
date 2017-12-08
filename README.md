# EMESpy.js

## Overview

This is a tool to spy on most EME-related browser API calls.

Everytime any of the following API have been triggered, this tool logs the arguments with which the call was done, and also logs the response when it has succeeded or failed:
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

## How to use it

To use it, either include the script in [src/EMESpy.js](https://github.com/peaBerberian/EMESpy.js/blob/master/src/EMESpy.js) in the wanted page, or copy and paste it in your browser's inspector, as the wanted page is loading / loaded.

This tool also exposes an object, ``EME_CALLS``, containing every details about all the API calls (date at which it has been called, context, arguments, response, date of the response, errors...).

## Deactivating the spy

You can re-deactivate the logs after adding this script by calling ``window.restoreEME()``.

## Defining a custom logger

You can also define a custom logger by redefining the following functions:
  - ``window.spyLogger.debug``: triggered with one or multiple arguments each time an API is called / resolved. This function can be given text as well as objects (the arguments or the response).
  - ``window.spyLogger.error``: triggered with one or multiple arguments each time an API errored / rejected. This function can be given text as well as objects (the error).
