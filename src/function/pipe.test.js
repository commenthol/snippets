import assert from 'node:assert'
import { pipe, pipeFnArgs } from './pipe.js'

const add = (a, b) => a + b

const sub = (a, b) => a - b

const curry = (fn, b) => (a) => fn(a, b)

describe('function/pipe', () => {
  it('shall pipe synchronous functions', async () => {
    assert.equal(
      pipe(
        curry(add, 3), // r + 3
        curry(sub, 7), // r - 7
        Math.abs // abs(r)
      )(2),
      2
    ) // abs((2 + 3) - 7)
  })
})

describe('function/pipeFnArgs', () => {
  it('shall pipe synchronous functions', async () => {
    assert.equal(pipeFnArgs([add, 3], [sub, 7], [Math.abs])(2), 2) // abs((2 + 3) - 7)
  })
})
