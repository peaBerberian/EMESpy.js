import generateId from "./generate_id.js";
import Logger from "./logger.js";

function getEventLog(logObject, eventName) {
  if (logObject[eventName] == null) {
    logObject[eventName] = {
      addEventListener: [],
      removeEventListener: [],
      listenerCalls: [],
    };
  }
  return logObject[eventName];
}

function getListenerKey(eventName, options) {
  const capture =
    typeof options === "boolean" ? options : options?.capture === true;
  return `${eventName}:${capture}`;
}

function getListenerRecord(listenerMap, eventName, listener) {
  if (
    typeof listener !== "function" &&
    (typeof listener !== "object" || listener === null)
  ) {
    return undefined;
  }

  const eventMap = listenerMap.get(listener);
  return eventMap == null ? undefined : eventMap.get(eventName);
}

function deleteListenerRecord(listenerMap, eventName, listener) {
  if (
    typeof listener !== "function" &&
    (typeof listener !== "object" || listener === null)
  ) {
    return;
  }

  const eventMap = listenerMap.get(listener);
  if (eventMap != null) {
    eventMap.delete(eventName);
  }
}

function setListenerRecord(listenerMap, eventName, listener, listenerRecord) {
  if (
    typeof listener !== "function" &&
    (typeof listener !== "object" || listener === null)
  ) {
    return;
  }

  let eventMap = listenerMap.get(listener);
  if (eventMap == null) {
    eventMap = new Map();
    listenerMap.set(listener, eventMap);
  }
  eventMap.set(eventName, listenerRecord);
}

function getAbortSignal(options) {
  return typeof options === "object" && options !== null
    ? options.signal
    : undefined;
}

function shouldRunOnce(options) {
  return (
    typeof options === "object" && options !== null && options.once === true
  );
}

export default function spyOnEventTarget(
  baseObject,
  eventNames,
  humanReadablePath,
  logObject,
) {
  if (baseObject == null) {
    console.warn(`Cannot spy on ${humanReadablePath}: object is unavailable`);
    return null;
  }

  const oldAddEventListener = baseObject.addEventListener;
  const oldRemoveEventListener = baseObject.removeEventListener;
  const listenerMap = new WeakMap();

  if (oldAddEventListener == null || oldRemoveEventListener == null) {
    console.warn(`Cannot spy on ${humanReadablePath}: EventTarget unavailable`);
    return null;
  }

  baseObject.addEventListener = function addEventListener(
    type,
    listener,
    options,
  ) {
    if (
      !eventNames.includes(type) ||
      (typeof listener !== "function" &&
        (typeof listener !== "object" || listener === null))
    ) {
      return oldAddEventListener.call(this, type, listener, options);
    }

    Logger.onEventListenerAdd(humanReadablePath, type, listener);
    getEventLog(logObject, type).addEventListener.push({
      self: this,
      id: generateId(),
      date: Date.now(),
      type,
      listener,
      options,
    });

    const listenerKey = getListenerKey(type, options);
    const existingRecord = getListenerRecord(
      listenerMap,
      listenerKey,
      listener,
    );

    if (existingRecord != null) {
      return oldAddEventListener.call(
        this,
        type,
        existingRecord.wrappedListener,
        options,
      );
    }

    const signal = getAbortSignal(options);
    const runOnce = shouldRunOnce(options);
    let listenerRecord;

    const wrappedListener = function emeSpyEventListener(event) {
      if (runOnce) {
        deleteListenerRecord(listenerMap, listenerKey, listener);
        if (listenerRecord?.abortHandler != null) {
          signal?.removeEventListener("abort", listenerRecord.abortHandler);
        }
      }

      Logger.onEvent(`${humanReadablePath}.${type}`, event);
      getEventLog(logObject, type).listenerCalls.push({
        self: this,
        id: generateId(),
        date: Date.now(),
        event,
        listener,
      });

      if (typeof listener === "function") {
        return listener.call(this, event);
      }
      return listener.handleEvent(event);
    };

    listenerRecord = {
      abortHandler: undefined,
      signal,
      wrappedListener,
    };

    if (signal?.aborted === true) {
      return oldAddEventListener.call(this, type, wrappedListener, options);
    }

    if (signal != null) {
      listenerRecord.abortHandler = function onAbort() {
        deleteListenerRecord(listenerMap, listenerKey, listener);
      };
      signal.addEventListener("abort", listenerRecord.abortHandler, {
        once: true,
      });
    }

    setListenerRecord(listenerMap, listenerKey, listener, listenerRecord);
    return oldAddEventListener.call(this, type, wrappedListener, options);
  };

  baseObject.removeEventListener = function removeEventListener(
    type,
    listener,
    options,
  ) {
    const listenerKey = getListenerKey(type, options);
    const listenerRecord = getListenerRecord(
      listenerMap,
      listenerKey,
      listener,
    );

    if (
      !eventNames.includes(type) ||
      listener == null ||
      listenerRecord == null
    ) {
      return oldRemoveEventListener.call(this, type, listener, options);
    }

    Logger.onEventListenerRemove(humanReadablePath, type, listener);
    getEventLog(logObject, type).removeEventListener.push({
      self: this,
      id: generateId(),
      date: Date.now(),
      type,
      listener,
      options,
    });

    deleteListenerRecord(listenerMap, listenerKey, listener);
    if (listenerRecord.abortHandler != null) {
      listenerRecord.signal?.removeEventListener(
        "abort",
        listenerRecord.abortHandler,
      );
    }

    return oldRemoveEventListener.call(
      this,
      type,
      listenerRecord.wrappedListener,
      options,
    );
  };

  return function stopSpyingOnEventTarget() {
    baseObject.addEventListener = oldAddEventListener;
    baseObject.removeEventListener = oldRemoveEventListener;
  };
}
