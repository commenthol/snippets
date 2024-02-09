import { deepStrictEqual, strictEqual } from 'assert'
import { UndoStack } from './index.js'

const assertStack = (res, exp) => {
  ;['max', 'low', 'pos', 'high'].forEach(k => strictEqual(res[k], exp[k], k))
  deepStrictEqual(res.stack, exp.stack)
}

describe('array/Stack', function () {
  it('shall push items to stack', function () {
    const s = new UndoStack({ max: 3 })
    s.push(1).push(2).push(3)
    assertStack(s, { max: 3, stack: [1, 2, 3], low: 0, high: 2, pos: 2 })
  })

  it('shall push items to stack beyond max', function () {
    const s = new UndoStack({ max: 3 })
    s.push(1).push(2).push(3).push(4)
    assertStack(s, { max: 3, stack: [4, 2, 3], low: 1, high: 0, pos: 0 })
  })

  it('shall push items to stack and undo', function () {
    const s = new UndoStack({ max: 3, stack: [1, 2, 3] })
    const r = s.undo()
    strictEqual(r, 2)
    assertStack(s, { max: 3, stack: [1, 2, 3], low: 0, high: 2, pos: 1 })
  })

  it('shall push items to stack and undo', function () {
    const s = new UndoStack({ max: 3, stack: [1, 2, 3] })
    const r = s.push(4).undo()
    strictEqual(r, 3)
    assertStack(s, { max: 3, stack: [4, 2, 3], low: 1, high: 0, pos: 2 })
  })

  it('shall push items to stack do 2x undo', function () {
    const s = new UndoStack({ max: 3, stack: [1, 2, 3] })
    s.push(4).undo()
    const r = s.undo()
    strictEqual(r, 2)
    assertStack(s, { max: 3, stack: [4, 2, 3], low: 1, high: 0, pos: 1 })
  })

  it('shall be undefined after 3x undo', function () {
    const s = new UndoStack({ max: 3, stack: [1, 2, 3] })
    s.push(4).undo()
    s.undo()
    const r = s.undo()
    strictEqual(r, undefined)
    assertStack(s, { max: 3, stack: [4, 2, 3], low: 1, high: 0, pos: 1 })
  })

  it('shall be undefined on redo', function () {
    const s = new UndoStack({ max: 3, stack: [1, 2, 3] })
    s.push(4)
    const r = s.redo()
    strictEqual(r, undefined)
    assertStack(s, { max: 3, stack: [4, 2, 3], low: 1, high: 0, pos: 0 })
  })

  it('shall overwrite after undo', function () {
    const s = new UndoStack({ max: 3, stack: [1, 2, 3] })
    s.push(4).undo()
    s.push(5)
    assertStack(s, { max: 3, stack: [5, 2, 3], low: 1, high: 0, pos: 0 })
  })

  it('shall be in same state after undo and redo', function () {
    const undoredo = 2
    const s = new UndoStack({ max: 3 })
    s.push(1).push(2).push(3).push(4).push(5).push(6).push(7)
    for (let i = 0; i < undoredo; i++) {
      s.undo()
    }
    for (let i = 0; i < undoredo; i++) {
      s.redo()
    }
    assertStack(s, { max: 3, stack: [7, 5, 6], low: 1, high: 0, pos: 0 })
  })
})
