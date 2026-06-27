export default function getPropertyDescriptor(baseObject, propertyName) {
  let currentObject = baseObject;

  while (currentObject != null) {
    const descriptor = Object.getOwnPropertyDescriptor(
      currentObject,
      propertyName,
    );
    if (descriptor != null) {
      return {
        descriptor,
        owner: currentObject,
      };
    }
    currentObject = Object.getPrototypeOf(currentObject);
  }

  return null;
}
