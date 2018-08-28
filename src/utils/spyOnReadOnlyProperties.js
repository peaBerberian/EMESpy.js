import Logger from "./logger.js";
import generateId from "./generate_id.js";

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
export default function spyOnReadOnlyProperties(
  baseObject,
  baseDescriptors,
  propertyNames,
  humanReadablePath,
  logObject,
) {
  for (let i = 0; i < propertyNames.length; i++) {
    const propertyName = propertyNames[i];
    const baseDescriptor = baseDescriptors[propertyName];
    const completePath = humanReadablePath + "." + propertyName;

    if (!baseDescriptor) {
      throw new Error("No descriptor for property " +
        completePath);
    }

    Object.defineProperty(baseObject, propertyName, {
      get() {
        const value = baseDescriptor.get.bind(this)();
        Logger.onPropertyAccess(completePath, value);
        const currentLogObject = {
          self: this,
          id: generateId(),
          date: Date.now(),
          value: value,
        };
        if (!logObject[propertyName]) {
          logObject[propertyName] = {
            get: [],
          };
        }
        logObject[propertyName].get.push(currentLogObject);
        return value;
      },
    });
  }

  return function stopSpyingOnReadOnlyProperties() {
    Object.defineProperties(baseObject,
      propertyNames
        .reduce((acc, propertyName) => {
          acc[propertyName] = baseDescriptors[propertyName];
          return acc;
        }, {})
    );
  };
}
