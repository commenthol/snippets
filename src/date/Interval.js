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
    this._timer = null
    this._unref = false
  }

  start () {
    if (this._timer) return
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
