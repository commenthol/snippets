import assert from 'assert'
import { customSort } from './index.js'

const log = process.env.SHOW_LOG ? console.log : () => {}

describe('object/customSort', () => {
  it('should sort keys ascending', () => {
    // does not work with number-like keys! They are always put at first
    const obj = {
      z: 1,
      p5: 2,
      m: 3,
      a: 0,
      p: 4,
      p1: 5,
      0: 6
    }
    const result = customSort(obj, ['p5', 'p4', 'z'])
    log(result)
    assert.deepStrictEqual(
      result,
      { 0: 6, p5: 2, z: 1, a: 0, m: 3, p: 4, p1: 5 }
    )
  })

  it('should sort keys by custom order', () => {
    const obj = {
      z: 1,
      p5: 2,
      m: 3,
      a: 0,
      p: 4,
      0: 6,
      p1: 5
    }
    const result = customSort(obj, ['p5', 'p4', 'z'])
    log(result)
    assert.deepStrictEqual(
      result,
      { 0: 6, p5: 2, z: 1, a: 0, m: 3, p: 4, p1: 5 }
    )
  })

  it('should sort keys by custom order and nesting depth', () => {
    const obj = {
      a: {
        c: 2,
        d: 3,
        b: 1,
        z: 0
      },
      m: {
        n: 1,
        p: 0,
        o: 2
      },
      p: {
        s: 3,
        q: 1,
        p: 0,
        r: 2
      },
      z: {
        a: 2,
        p: 0,
        x: 3,
        z: 1
      }
    }
    const result = customSort(obj, ['p', 'z'], { depth: 3 })
    log(result)
    assert.deepStrictEqual(
      result,
      {
        p: { p: 0, q: 1, r: 2, s: 3 },
        z: { p: 0, z: 1, a: 2, x: 3 },
        a: { z: 0, b: 1, c: 2, d: 3 },
        m: { p: 0, n: 1, o: 2 }
      }
    )
  })
})
