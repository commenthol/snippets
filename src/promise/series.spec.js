import assert from 'assert'
import { series } from '.'

describe('promise/series', () => {
  it('result should be 15', () => {
    const sum = series(
      x => x + 1,
      x => new Promise(resolve => setTimeout(() => resolve(x + 2), 10)),
      x => x + 3,
      x => Promise.resolve(x + 4)
    )
    return sum(5).then((res) => {
      assert.strictEqual(res, 15)
    })
  })
})
