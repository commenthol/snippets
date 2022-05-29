import assert from 'assert'
import { equal } from './index.js'

describe('object/equal', () => {
  it('should be equal', () => {
    assert.strictEqual(
      equal({}, {}), true
    )
  })

  it('should not be equal', () => {
    assert.strictEqual(
      equal({}, null), false
    )
  })
})
