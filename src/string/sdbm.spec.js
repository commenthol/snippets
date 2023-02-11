import assert from 'assert'
import { sdbm } from './sdbm.js'

describe('string/sdbm', function () {
  it('shall hash "drop☔️" to number', function () {
    assert.equal(sdbm('drop☔️'), 1917973322)
  })
})
