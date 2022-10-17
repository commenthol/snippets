import assert from 'assert'
import { parse } from './parseUrl.js'
import * as url from 'url'

// eslint-disable-next-line n/no-deprecated-api
const legacyParse = url.parse

describe('node/http/parseUrl', function () {
  it('shall parse url', function () {
    const url = 'https://user:auth@sub.domain.com:8888/path/to/folder?query=1&foo=bar#hash=new'
    assert.deepStrictEqual(
      parse(url),
      { ...legacyParse(url) }
    )
  })

  it('shall parse url with user', function () {
    const url = 'https://user@sub.domain.com:8888/path/to/folder?query=1&foo=bar#hash=new'
    assert.deepStrictEqual(
      parse(url),
      { ...legacyParse(url), auth: 'user:' }
    )
  })

  it('shall parse server url', function () {
    const url = '/path/to/folder?query=1&foo=bar#hash=new'
    assert.deepStrictEqual(
      parse(url),
      // {},
      { ...legacyParse(url) }
    )
  })
})
