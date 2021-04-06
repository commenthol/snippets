import assert from 'assert'
import { dedupe, sleep } from '.'

describe('promise/dedupe', () => {
  it('shall return result', async () => {
    let called = 0
    const de = dedupe(sleep(5)
      .then(() => {
        called++
        return 5
      })
    )
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
