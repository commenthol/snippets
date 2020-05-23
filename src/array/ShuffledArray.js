
export class ShuffledArray {
  constructor (length) {
    this.length = length
    this._reset()
  }

  _reset () {
    this._values = new Array(this.length).fill()
      .map((_, i) => ({ r: Math.random(), i }))
      .sort((a, b) => a.r - b.r)
      .map(({ i }) => i)
  }

  next () {
    const v = this._values.pop()
    if (this._values.length === 0) this._reset()
    return v
  }
}
