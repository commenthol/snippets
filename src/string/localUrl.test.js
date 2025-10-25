import assert from 'node:assert'
import { LocalURL } from './localUrl.js'

describe('string/LocalURL', function () {
  it('shall instantiate', function () {
    const lurl = new LocalURL()
    assert.equal(lurl.isLocal(), true)
    assert.equal(lurl.toString(), '')
  })

  it('shall instantiate with pathname', function () {
    const uri = '/path/one'
    const lurl = new LocalURL(uri)
    assert.equal(lurl.isLocal(), true)
    assert.equal(lurl.toString(), uri)
  })

  it('shall instantiate with search params', function () {
    const uri = '?foo=bar&test=1'
    const lurl = new LocalURL(uri)
    assert.equal(lurl.isLocal(), true)
    assert.equal(lurl.toString(), uri)
  })

  it('shall instantiate with LocalURL', function () {
    const uri = '/path/one?foo=bar&test=1'
    const lurl1 = new LocalURL(uri)
    const lurl = new LocalURL(lurl1)
    assert.equal(lurl.isLocal(), true)
    assert.equal(lurl, uri)
  })

  it('shall instantiate with URL', function () {
    const url = new URL('https://test.tld/path/one?foo=bar&test=1')
    const lurl = new LocalURL(url)
    assert.equal(lurl.isLocal(), false)
    assert.equal(lurl.toString(), url.toString())
  })

  it('shall instantiate with URLstring', function () {
    const url = 'https://test.tld/path/one?foo=bar&test=1'
    const lurl = new LocalURL(url)
    assert.equal(lurl.isLocal(), false)
    assert.equal(lurl.toString(), url)
  })

  it('shall reset search params', function () {
    const url = 'https://test.tld/path/one?foo=bar&test=1'
    const lurl = new LocalURL(url)
    lurl.setSearchParams({ wat: 'baz', taste: 'yummy' })
    assert.equal(
      lurl.toString(),
      'https://test.tld/path/one?wat=baz&taste=yummy'
    )
  })
})
