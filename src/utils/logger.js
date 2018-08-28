/**
 * Define the logger for the MSE-spy.
 * Allows to re-define a specific logger on runtime / before applying this
 * script.
 * @type {Object}
 */
const Logger = window.MSESpyLogger || {
  /* eslint-disable no-console */

  /**
   * Triggered each time a property is accessed.
   * @param {string} pathString - human-readable path to the property.
   * @param {*} value - the value it currently has.
   */
  onPropertyAccess(pathString, value) {
    console.debug(`>>> Getting ${pathString}:`, value);
  },

  /**
   * Triggered each time a property is set.
   * @param {string} pathString - human-readable path to the property.
   * @param {*} value - the value it is set to.
   */
  onSettingProperty(pathString, value) {
    console.debug(`>> Setting ${pathString}:`, value);
  },

  /**
   * Triggered when some object is instanciated (just before).
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {Array.<*>} args - Arguments given to the constructor
   */
  onObjectInstanciation(objectName, args) {
    if (args.length) {
      console.debug(`>>> Creating ${objectName} with arguments:`, args);
    } else {
      console.debug(`>>> Creating ${objectName}`);
    }
  },

  /**
   * Triggered when an Object instanciation failed.
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {Error} error - Error thrown by the constructor
   */
  onObjectInstanciationError(objectName, error) {
    console.error(`>> ${objectName} creation failed:`, error);
  },

  /**
   * Triggered when an Object instanciation succeeded.
   * @param {string} objectName - human-readable name for the concerned object.
   * @param {*} value - The corresponding object instanciated.
   */
  onObjectInstanciationSuccess(objectName, value) {
    console.debug(`>>> ${objectName} created:`, value);
  },

  /**
   * Triggered when some method/function is called.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {Array.<*>} args - Arguments given to this function.
   */
  onFunctionCall(pathName, args) {
    if (args.length) {
      console.debug(`>>> ${pathName} called with arguments:`, args);
    } else {
      console.debug(`>>> ${pathName} called`);
    }
  },

  /**
   * Triggered when a function call fails.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {Error} error - Error thrown by the call
   */
  onFunctionCallError(pathName, error) {
    console.error(`>> ${pathName} failed:`, error);
  },

  /**
   * Triggered when a function call succeeded.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The result of the function
   */
  onFunctionCallSuccess(pathName, value) {
    console.info(`>>> ${pathName} succeeded:`, value);
  },

  /**
   * Triggered when a function returned a Promise and that promise resolved.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The value when the function resolved.
   */
  onFunctionPromiseResolve(pathName, value) {
    console.info(`>>> ${pathName} resolved:`, value);
  },

  /**
   * Triggered when a function returned a Promise and that promise rejected.
   * @param {string} pathName - human-readable path for the concerned function.
   * @param {*} value - The error when the function's promise rejected.
   */
  onFunctionPromiseReject(pathName, value) {
    console.error(`>>> ${pathName} rejected:`, value);
  },
  /* eslint-enable no-console */
};

export default Logger;
