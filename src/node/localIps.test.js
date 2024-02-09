import assert from 'assert'
import { localIps } from './index.js'

describe('node/localIps', () => {
  it('should return local ip addresses', () => {
    const result = localIps()
    // console.log(result)
    assert.ok(Array.isArray(result))
    assert.strictEqual(typeof result[0].name, 'string')
    assert.strictEqual(typeof result[0].address, 'string')
  })
})
