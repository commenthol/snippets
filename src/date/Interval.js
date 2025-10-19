/**
 * a timing save interval timer
 * prevents that interval events pile up if event loop gets blocked by a
 * "long" running function
 */
export class Interval {
  /**
   * @param {() => void} onTimeout - function called on timeout
   * @param {number} timeout - timeout in milliseconds
   */
  constructor(onTimeout, timeout) {
    this._onTimeout = onTimeout
    this._timeout = Math.max(0, timeout)
    this._timer = null
    this._unref = false
  }

  /**
   * @returns {this}
   */
  start() {
    if (this._timer) return this
    this._timer = setTimeout(() => {
      this._onTimeout()
      if (this._timer) {
        this._timer = null
        this.start()
      }
    }, this._timeout)
    if (this._unref) {
      this._timer.unref()
    }
    return this
  }

  /**
   * When called, the active Timeout object will not require the Node.js event
   * loop to remain active. If there is no other activity keeping the event loop
   * running, the process may exit before the Timeout object's callback is
   * invoked. Calling timeout.unref() multiple times will have no effect.
   * @returns {this}
   */
  unref() {
    this._unref = true
    this._timer && this._timer.unref()
    return this
  }

  /**
   * cancels the timer interval
   * @returns {this}
   */
  clear() {
    clearTimeout(this._timer)
    this._timer = null
    return this
  }
}

/**
 * @param {() => void} onTimeout - function called on timeout
 * @param {number} timeout - timeout in milliseconds
 * @returns {Interval}
 */
export const startInterval = (onTimeout, timeout) =>
  new Interval(onTimeout, timeout).start()
