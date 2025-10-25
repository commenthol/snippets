/**
 * Observer Pattern / Event Emitter
 */
export class EventEmitter {
  _events = {}

  constructor() {
    this.clear()
  }

  /**
   * @private
   * @param {string} eventName
   * @returns {Set} Set of listeners
   */
  _get(eventName) {
    if (!this._events[eventName]) {
      this._events[eventName] = new Set()
    }
    return this._events[eventName]
  }

  /**
   * clears all event listeners
   */
  clear() {
    this._events = {}
  }

  /**
   * add event listener
   * @param {string} eventName
   * @param {Function} listener
   * @returns {this}
   */
  on(eventName, listener) {
    this._get(eventName).add(listener)
    return this
  }

  /**
   * remove event listener
   * @param {string} eventName
   * @param {Function} [listener] if omitted all listeners on `eventName` are removed
   * @returns {this}
   */
  off(eventName, listener) {
    listener
      ? this._get(eventName).delete(listener)
      : delete this._events[eventName]
    return this
  }

  /**
   * emit event (synchronous operation!)
   * @param {string} eventName
   * @param  {...any} args
   */
  emit(eventName, ...args) {
    for (const listener of this._get(eventName)) {
      listener(...args)
    }
    return this
  }
}
