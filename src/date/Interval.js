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
  constructor (onTimeout, timeout) {
    this._onTimeout = onTimeout
    this._timeout = Math.max(0, timeout)
    this._unref = false
  }

  start () {
    this._timer = setTimeout(() => {
      this.clear()
      this._onTimeout()
      this.start()
    }, this._timeout)
    if (this._unref) {
      this._timer.unref()
    }
    return this
  }

  unref () {
    this._unref = true
    this._timer && this._timer.unref()
    return this
  }

  clear () {
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
