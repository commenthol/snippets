import assert from 'node:assert'
import { onetime } from './onetime.js'

describe('function/onetime', () => {
  it('shall only be called once', () => {
    let i = 0
    const one = onetime(() => ++i)
    assert.equal(one(), 1)
    assert.equal(one(), 1)
    assert.equal(one(), 1)
  })
})
