import assert from 'assert'
import {uuid4} from '../../src/string'

describe('string/uuid4', () => {
  const uuid = uuid4()
  it('should contain dashes in proper places', () => {
    assert.deepEqual([uuid[8], uuid[13], uuid[18], uuid[23]], ['-', '-', '-', '-'])
  })
  it('should only contain hexadecimal digits', () => {
    assert.ok(/^[0-9A-Fa-f-]+$/.test(uuid))
  })
  it('should be different between calls', () => {
    const one = uuid4()
    const two = uuid4()
    assert.ok(one !== two)
  })
})
