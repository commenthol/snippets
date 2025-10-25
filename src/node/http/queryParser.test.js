import assert from 'node:assert'
import { queryParser } from './queryParser.js'

/** @typedef {import('./connect-types.js').IncomingMessage} IncomingMessage */

function Request(url) {
  this.url = url
}

describe('node/http/queryParser', function () {
  it('shall parse query string', function (done) {
    /** @type {IncomingMessage} */
    // @ts-ignore
    const req = new Request('/home/user?a=0&b=foo&a=1&a=2')
    const res = {}
    // @ts-ignore
    queryParser()(req, res, () => {
      assert.strictEqual(req.path, '/home/user')
      assert.deepStrictEqual(req.query, {
        a: ['0', '1', '2'],
        b: 'foo',
      })
      done()
    })
  })
})
