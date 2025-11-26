import assert from 'node:assert'
import { ExpiryMap } from './index.js'
import { nap } from '../promise/index.js'

describe('pattern/ExpiryMap', function () {
  it('shall expire values', async function () {
    const ec = new ExpiryMap(50)
    ec.set('a', 1)
    await nap(40)
    assert.equal(ec.get('a'), 1)
    // console.log(ec)
    await nap(15)
    assert.equal(ec.get('a'), undefined)
  })

  it('shall set', async function () {
    const ec = new ExpiryMap(50)
    for (let i = 0; i < 100; i++) {
      ec.set(i, i, 100 - i)
    }
    assert.ok(deviate(ec.size, 99), '' + ec.size)
    await nap(30)
    assert.ok(deviate(ec.size, 68), '' + ec.size)
    await nap(30)
    const found = []
    for (let i = 0; i < 100; i++) {
      const val = ec.get(i)
      if (val !== undefined) found.push(val)
    }
    // console.log(found)
    assert.ok(deviate(found.length, 37), '' + found.length)
  })
})

/**
 * @param {number} actual
 * @param {number} expected
 * @param {number} [deviation]
 * @returns
 */
const deviate = (actual, expected, deviation = 2) =>
  actual >= expected - deviation && actual <= expected + deviation
