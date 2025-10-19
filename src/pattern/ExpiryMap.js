/**
 * map with expiring entries
 */
export class ExpiryMap extends Map {
  /**
   * @param {number} expires - in milliseconds; default 1min
   * @param {number} interval - in milliseconds; default expires/2; 0 means that no
   * cleanup timer is triggered
   */
  constructor(expires = 60e3, interval) {
    super()
    this._expires = expires
    this._interval = interval ?? Math.max(100, expires / 2)
    this._timer()
  }

  /**
   * @private
   */
  _timer() {
    if (this._interval <= 0 || this._timerId) {
      return
    }
    this._timerId = setTimeout(() => {
      this.cleanup()
      this._timerId = undefined
      this._timer()
    }, this._interval)
    this._timerId?.unref && this._timerId.unref()
  }

  /**
   * cleanup expired entries
   */
  cleanup() {
    for (const [key, { expiresAt }] of this.entries()) {
      if (expiresAt <= Date.now()) {
        this.delete(key)
      }
    }
  }

  get size() {
    this.cleanup()
    return super.size
  }

  get(key) {
    const { expiresAt, value } = super.get(key) || {}
    if (expiresAt > Date.now()) {
      return value
    }
    this.delete(key)
  }

  /**
   * @param {any} key
   * @param {any} value
   * @param {number} [expires] - expiry in milliseconds
   */
  set(key, value, expires = this._expires) {
    const expiresAt = Date.now() + expires
    return super.set(key, { value, expiresAt })
  }
}
