import generateId from "./generate_id.js";
import getPropertyDescriptor from "./getPropertyDescriptor.js";
import Logger from "./logger.js";

function getEventLog(logObject, eventName) {
  if (logObject[eventName] == null) {
    logObject[eventName] = {
      eventHandler: {
        get: [],
        set: [],
        calls: [],
      },
    };
  } else if (logObject[eventName].eventHandler == null) {
    logObject[eventName].eventHandler = {
      get: [],
      set: [],
      calls: [],
    };
  }
  return logObject[eventName].eventHandler;
}

export default function spyOnEventHandlerProperties(
  baseObject,
  eventHandlerNames,
  humanReadablePath,
  logObject,
) {
  if (baseObject == null) {
    console.warn(`Cannot spy on ${humanReadablePath}: object is unavailable`);
    return null;
  }

  const spiedProperties = [];

  for (let i = 0; i < eventHandlerNames.length; i++) {
    const propertyName = eventHandlerNames[i];
    const descriptorInfo = getPropertyDescriptor(baseObject, propertyName);
    const completePath = `${humanReadablePath}.${propertyName}`;
    const eventName = propertyName.startsWith("on")
      ? propertyName.slice(2)
      : propertyName;
    const originalHandlers = new WeakMap();

    if (
      descriptorInfo == null ||
      descriptorInfo.descriptor.get == null ||
      descriptorInfo.descriptor.set == null
    ) {
      console.warn(`No descriptor for event handler property ${completePath}`);
      continue;
    }

    const baseDescriptor = descriptorInfo.descriptor;

    Object.defineProperty(baseObject, propertyName, {
      configurable: true,
      enumerable: baseDescriptor.enumerable,
      get() {
        const value = baseDescriptor.get.call(this);
        const originalValue = originalHandlers.get(value) || value;
        Logger.onPropertyAccess(completePath, originalValue);
        getEventLog(logObject, eventName).get.push({
          self: this,
          id: generateId(),
          date: Date.now(),
          value: originalValue,
        });
        return originalValue;
      },
      set(value) {
        Logger.onSettingProperty(completePath, value);
        getEventLog(logObject, eventName).set.push({
          self: this,
          id: generateId(),
          date: Date.now(),
          value,
        });

        if (typeof value !== "function") {
          baseDescriptor.set.call(this, value);
          return;
        }

        const wrappedHandler = function emeSpyEventHandler(event) {
          Logger.onEvent(completePath, event);
          getEventLog(logObject, eventName).calls.push({
            self: this,
            id: generateId(),
            date: Date.now(),
            event,
            listener: value,
          });
          return value.call(this, event);
        };
        originalHandlers.set(wrappedHandler, value);
        baseDescriptor.set.call(this, wrappedHandler);
      },
    });

    spiedProperties.push({
      descriptor: baseDescriptor,
      owner: descriptorInfo.owner,
      propertyName,
    });
  }

  return function stopSpyingOnEventHandlerProperties() {
    for (let i = 0; i < spiedProperties.length; i++) {
      const spiedProperty = spiedProperties[i];
      if (spiedProperty.owner === baseObject) {
        Object.defineProperty(
          baseObject,
          spiedProperty.propertyName,
          spiedProperty.descriptor,
        );
      } else {
        delete baseObject[spiedProperty.propertyName];
      }
    }
  };
}
