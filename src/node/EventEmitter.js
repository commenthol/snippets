/**
 * EventEmitter using Map() internally
 */
export class EventEmitter {
  constructor() {
    this._events = {}
    this.addListener = this.on
    this.removeListener = this.off
  }

  _getMap(eventName) {
    if (!this._events[eventName]) this._events[eventName] = new Map()
    return this._events[eventName]
  }

  on(eventName, listener) {
    this._getMap(eventName).set(listener, listener)
    return this
  }

  once(eventName, listener) {
    this._getMap(eventName).set(listener, (...args) => {
      this.off(eventName, listener)
      listener(...args)
    })
    return this
  }

  off(eventName, listener) {
    this._getMap(eventName).delete(listener)
    return this
  }

  emit(eventName, ...args) {
    for (const [_, listener] of this._getMap(eventName)) {
      listener(...args)
    }
  }

  removeAllListeners(eventName) {
    if (!eventName) {
      Object.keys(this._events).forEach((eventName) =>
        this._getMap(eventName).clear()
      )
      this._events = {}
    } else {
      this._getMap(eventName).clear()
      Reflect.deleteProperty(this._events, eventName)
    }
  }

  listenerCount(eventName) {
    return this._getMap(eventName).size
  }
}
