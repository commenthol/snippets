/**
 * Stack with limited size
 */
export class UndoStack {
  /**
   * [constructor description]
   * @param {number} [max=100] - max. number of items the stack can hold
   * @param {Array<any>} [stack] - initial stack
   */
  constructor ({ max = 100, stack = [] } = {}) {
    this.max = max
    this.stack = stack
    this.low = 0
    this.pos = this.high = stack.length - 1
  }

  push (item) {
    this.pos += 1
    if (this.pos < this.max && this.stack.length < this.max) {
      this.stack.push(item)
    } else {
      this.pos %= this.max
      this.stack[this.pos] = item
      if (this.pos === this.low) {
        this.low = inc(this.low, this.max)
      }
    }
    this.high = this.pos
    return this
  }

  last () {
    return this.stack[this.pos]
  }

  undo () {
    if (this.pos === this.low) return
    this.pos = dec(this.pos, this.max)
    return this.last()
  }

  redo () {
    if (this.pos === this.high) return
    this.pos = inc(this.pos, this.max)
    return this.last()
  }
}

const inc = (i, max) => (i + 1) % max
const dec = (i, max) => (i - 1 + max) % max
