export class ShuffledArray {
  _values = []

  /**
   * create a random shuffled array of `length`
   * @param {number} length
   */
  constructor(length) {
    this.length = length
    this._reset()
  }

  /**
   * @private
   */
  _reset() {
    this._values = new Array(this.length)
      .fill(0)
      .map((_, i) => ({ r: Math.random(), i }))
      .sort((a, b) => a.r - b.r)
      .map(({ i }) => i)
  }

  /**
   * @returns {number} next random value
   */
  next() {
    const v = this._values.pop()
    if (this._values.length === 0) this._reset()
    return v
  }
}
