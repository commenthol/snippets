import assert from 'assert'
import { uuid7, uuid7ms, uuid4 } from './index.js'

describe('string/uuid7', () => {
  const uuid = uuid7()

  it('should contain dashes in proper places', () => {
    assert.deepStrictEqual([uuid[8], uuid[13], uuid[18], uuid[23]], ['-', '-', '-', '-'])
  })

  it('shall have version 7', () => {
    assert.equal(uuid[14], '7')
  })

  it('should only contain hexadecimal digits', () => {
    assert.ok(/^[0-9A-Fa-f-]+$/.test(uuid))
  })

  it('should be different between calls', () => {
    const one = uuid7()
    const two = uuid7()
    assert.ok(one !== two)
  })

  it('uuid7ms shall return the timestamp', () => {
    const uuid = uuid7(0)
    assert.equal(uuid7ms(uuid).toISOString(), '1970-01-01T00:00:00.000Z')
  })

  it('uuid7ms shall throw if not a UUIDv7', () => {
    const uuid = uuid4()
    assert.throws(() => {
      uuid7ms(uuid)
    }, /not a UUIDv7/)
  })
})
