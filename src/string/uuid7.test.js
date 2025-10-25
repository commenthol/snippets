import assert from 'node:assert'
import { uuid7, uuid7date, uuid4 } from './index.js'

describe('string/uuid7', () => {
  const uuid = uuid7()

  it('should contain dashes in proper places', () => {
    assert.deepStrictEqual(
      [uuid[8], uuid[13], uuid[18], uuid[23]],
      ['-', '-', '-', '-']
    )
  })

  it('shall have version 7', () => {
    assert.equal(uuid[14], '7')
  })

  it('shall be strong monotonic', () => {
    const arr = new Array(1000).fill(0).map(() => uuid7())
    const sorted = arr.sort()
    assert.deepEqual(arr, sorted)
  })

  it('should only contain hexadecimal digits', () => {
    assert.ok(/^[0-9a-f-]+$/.test(uuid))
  })

  it('should be different between calls', () => {
    const one = uuid7()
    const two = uuid7()
    assert.ok(one !== two)
  })

  it('shall throw if less than 0', () => {
    assertThrows(() => {
      uuid7(-1)
    }, 'min date 1970-01-01')
  })

  it('shall throw if more than allowed date range', () => {
    const n = new Date('9999-12-31T23:59:59.999Z').getTime()
    assertThrows(() => {
      uuid7(n + 1)
    }, 'max date 9999-12-31')
  })

  it('uuid7date shall return the timestamp', () => {
    const uuid = uuid7(0)
    assert.equal(uuid7date(uuid).toISOString(), '1970-01-01T00:00:00.000Z')
  })

  it('uuid7date shall return the timestamp (upper)', () => {
    const d = '9999-12-31T23:59:59.999Z'
    const uuid = uuid7(new Date(d).getTime())
    assert.equal(uuid7date(uuid).toISOString(), d)
  })

  it('uuid7date shall throw if not a UUIDv7', () => {
    const uuid = uuid4()
    assertThrows(() => {
      uuid7date(uuid)
    }, 'not a UUIDv7')
  })
})

const assertThrows = (fn, expected) => {
  try {
    fn()
    throw new Error()
  } catch (/** @type {*} */ e) {
    assert.equal(e.message, expected)
  }
}
