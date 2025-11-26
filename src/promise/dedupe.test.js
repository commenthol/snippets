import assert from 'node:assert'
import { dedupe, nap } from './index.js'

describe('promise/dedupe', () => {
  it('shall return result', async () => {
    let called = 0

    const asyncFnToDedupe = () =>
      nap(5).then(() => {
        called++
        return 5
      })

    const de = dedupe(asyncFnToDedupe)
    let count = 0

    const final = (n) => {
      count += n
    }

    for (let i = 0; i < 10; i++) {
      de().then(final)
    }

    await nap(6).then(() => {
      assert.strictEqual(called, 1)
      assert.strictEqual(count, 50)
    })
  })
})
