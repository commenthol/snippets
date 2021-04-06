/**
 * a timing save interval timer
 */
export class Interval {
  /**
   * start interval timer
   * @param {Function} fn - function to run
   * @param {Number} timeout - in milliseconds
   */
  start (fn, timeout) {
    if (this._timer) return // prevent doubled timers
    this._timer = setTimeout(() => {
      this.clear()
      this.start(fn, timeout) // restart timer
      fn()
    }, timeout)
    return this
  }

  /**
   * clear interval timer
   */
  clear () {
    clearTimeout(this._timer)
    this._timer = null
  }
}

export const startInterval = (fn, timeout) => new Interval().start(fn, timeout)
