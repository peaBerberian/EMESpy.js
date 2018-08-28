import Logger from "./logger.js";
import generateId from "./generate_id.js";

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
export default function spyOnMethods(
  baseObject,
  methodNames,
  humanReadablePath,
  logObject,
) {
  const baseObjectMethods = methodNames
    .reduce((acc, methodName) => {
      acc[methodName] = baseObject[methodName];
      return acc;
    }, {});

  for (let i = 0; i < methodNames.length; i++) {
    const methodName = methodNames[i];
    const completePath = humanReadablePath + "." + methodName;
    const oldMethod = baseObject[methodName];

    if (!oldMethod) {
      throw new Error("No method in " + completePath);
    }

    baseObject[methodName] = function (...args) {
      Logger.onFunctionCall(completePath, args);
      const currentLogObject = {
        self: baseObject,
        id: generateId(),
        date: Date.now(),
        args,
      };

      if (!logObject[methodName]) {
        logObject[methodName] = [];
      }
      logObject[methodName].push(currentLogObject);

      let res;
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
          (value) => {
            Logger.onFunctionPromiseResolve(completePath, value);
            currentLogObject.responseResolved = value;
            currentLogObject.responseResolvedDate = Date.now();
          },

          // on error
          (err) => {
            Logger.onFunctionPromiseReject(completePath, err);
            currentLogObject.responseRejected = err;
            currentLogObject.responseRejectedDate = Date.now();
          }
        );
      }
      return res;
    };
  }

  return function stopSpyingOnMethods() {
    for (let i = 0; i < methodNames.length; i++) {
      const methodName = methodNames[i];
      baseObject[methodName] = baseObjectMethods[methodName];
    }
  };
}
