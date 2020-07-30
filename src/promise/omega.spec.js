import assert from 'assert'
import { omega } from '.'

describe('promise/omega', () => {
  it('shall return result', async () => {
    const fn = async (x) => Promise.resolve(x + 4)
    const [err, result] = await omega(fn)(6)
    assert.strictEqual(err, null)
    assert.strictEqual(result, 10)
  })
  it('shall return error', async () => {
    const fn = async (x) => Promise.reject(new TypeError('bamm'))
    const [err, result] = await omega(fn)(6)
    assert.strictEqual(err.message, 'bamm')
    assert.strictEqual(result, undefined)
  })
  it('shall return result - sync fn', async () => {
    const fn = async (x) => (x + 4)
    const [err, result] = await omega(fn)(6)
    assert.strictEqual(err, null)
    assert.strictEqual(result, 10)
  })
  it('shall return error - sync fn', async () => {
    const fn = async (x) => { throw new TypeError('bamm') }
    const [err, result] = await omega(fn)(6)
    assert.strictEqual(err.message, 'bamm')
    assert.strictEqual(result, undefined)
  })
})
