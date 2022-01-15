import assert from 'assert'
import { debounce } from './debounce.js'
import { sleep } from '../promise/sleep.js'

describe('function/debounce', function () {
  it('shall debounce', async function () {
    let count = 0
    const fn = () => {
      count += 1
    }

    const debounced = debounce(fn, 10)

    for (let i = 0; i < 3; i++) {
      debounced()
    }
    await sleep(12)

    debounced()
    await sleep(12)

    assert.strictEqual(count, 2)
  })
})
