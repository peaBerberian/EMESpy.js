import Logger from "./logger.js";
import spyOnMethods from "./spyOnMethods.js";
import spyOnReadOnlyProperties from "./spyOnReadOnlyProperties.js";
import spyOnProperties from "./spyOnProperties.js";

export default function spyOnWholeObject(
  BaseObject,
  objectName,
  readOnlyPropertyNames,
  propertyNames,
  staticMethodNames,
  methodNames,
  loggingObject
) {
  if (BaseObject == null || !BaseObject.prototype) {
    throw new Error("Invalid object");
  }

  if (loggingObject[objectName] == null) {
    loggingObject[objectName] = {
      new: [],
      methods: {},
      staticMethods: {},
      properties: {},
      eventListeners: {}, // TODO
    };
  }

  function StubbedObject(...args) {
    Logger.onObjectInstanciation(objectName, args);
    const now = Date.now();
    const spyObj = {
      date: now,
      args,
    };
    loggingObject[objectName].new.push(spyObj);
    let baseObject;
    try {
      baseObject = new BaseObject(...args);
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

  const unspyStaticMethods = spyOnMethods(
    BaseObject,
    staticMethodNames,
    objectName,
    loggingObject[objectName].staticMethods,
  );
  staticMethodNames.forEach((method) => {
    StubbedObject[method] = BaseObject[method].bind(BaseObject);
  });

  const BaseObjectProtoDescriptors =
    Object.getOwnPropertyDescriptors(BaseObject.prototype);

  const unspyReadOnlyProps = spyOnReadOnlyProperties(
    BaseObject.prototype,
    BaseObjectProtoDescriptors,
    readOnlyPropertyNames,
    `${objectName}.prototype`,
    loggingObject[objectName].properties,
  );
  const unspyProps = spyOnProperties(
    BaseObject.prototype,
    BaseObjectProtoDescriptors,
    propertyNames,
    `${objectName}.prototype`,
    loggingObject[objectName].properties,
  );
  const unspyMethods = spyOnMethods(
    BaseObject.prototype,
    methodNames,
    `${objectName}.prototype`,
    loggingObject[objectName].methods,
  );
  window[objectName] = StubbedObject;

  return function stopSpying() {
    unspyReadOnlyProps();
    unspyProps();
    unspyStaticMethods();
    unspyMethods();
    window[objectName] = BaseObject;
  };
}
