import assert from 'node:assert'
import { debounce } from './debounce.js'
import { nap } from '../promise/nap.js'

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
    await nap(12)

    debounced()
    await nap(12)

    assert.strictEqual(count, 2)
  })
})
