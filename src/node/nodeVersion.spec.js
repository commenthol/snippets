import assert from 'assert'
import { nodeVersion } from './index.js'

describe('node/nodeVersion', function () {
  it('shall obtain version', function () {
    const [major, minor, patch] = nodeVersion
    assert.strictEqual('v' + [major, minor, patch].join('.'), process.version)
  })
})
