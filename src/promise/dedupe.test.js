import assert from 'assert'
import { dedupe, sleep } from './index.js'

describe('promise/dedupe', () => {
  it('shall return result', async () => {
    let called = 0

    const asyncFnToDedupe = () =>
      sleep(5).then(() => {
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

    await sleep(6).then(() => {
      assert.strictEqual(called, 1)
      assert.strictEqual(count, 50)
    })
  })
})
