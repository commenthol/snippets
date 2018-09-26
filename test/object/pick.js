import assert from 'assert'
import {pick} from '../../src/object'

describe('object/pick', () => {
  it('should pick value from path', () => {
    const obj = {a: 1, b: 2, c: 3}
    assert.deepEqual(pick(obj, ['a', 'c']), {a: 1, c: 3})
  })
  it('should not pick undefined prop', () => {
    const obj = {a: 1, b: 2, c: 3}
    assert.deepEqual(pick(obj, ['d']), {})
  })
})
