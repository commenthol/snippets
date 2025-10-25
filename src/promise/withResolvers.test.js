import assert from 'node:assert'
import { withResolvers } from './index.js'

describe('promise/withResolvers', () => {
  it('shall resolve', async () => {
    const p = withResolvers()
    setTimeout(() => {
      p.resolve('hi')
    }, 20)
    assert.equal(await p.promise, 'hi')
  })

  it('shall reject', async () => {
    const p = withResolvers()
    setTimeout(() => {
      p.reject(new Error('bad'))
    }, 20)
    try {
      await p.promise
      throw new Error()
    } catch (/** @type {*} */ err) {
      assert.equal(err.message, 'bad')
    }
  })
})
