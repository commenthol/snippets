import assert from 'assert'
import { cookieParse, cookieSerialize } from './cookie.js'

describe('string/cookie', function () {
  describe('cookieParse', function () {
    it('empty string', function () {
      assert.deepStrictEqual(cookieParse(), {})
    })
    it('cookie string', function () {
      assert.deepStrictEqual(
        cookieParse(
          '_foobar=FB.1.12.24; preferred_color_mode=light; tz=Asia%2FTokyo'
        ),
        {
          _foobar: 'FB.1.12.24',
          preferred_color_mode: 'light',
          tz: 'Asia/Tokyo',
        }
      )
    })
  })

  describe('cookieSerialize', function () {
    it('empty string', function () {
      try {
        cookieSerialize()
        throw new Error('fail')
      } catch (e) {
        assert.strictEqual(e.message, 'invalid name')
      }
    })

    it('name value', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar or bär'),
        'foo=bar%20or%20b%C3%A4r; HttpOnly; SameSite=Strict'
      )
    })
    it('maxAge', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { maxAge: 10e3 }),
        'foo=bar; Max-Age=10000; HttpOnly; SameSite=Strict'
      )
    })
    it('domain', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { domain: 'foo.bar' }),
        'foo=bar; Domain=foo.bar; HttpOnly; SameSite=Strict'
      )
    })
    it('invalid domain', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { domain: 'f😀o.bar' }),
        'foo=bar; HttpOnly; SameSite=Strict'
      )
    })
    it('path', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { path: '/foobar' }),
        'foo=bar; Path=/foobar; HttpOnly; SameSite=Strict'
      )
    })
    it('invalid path', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { path: 'f😀o.bar' }),
        'foo=bar; HttpOnly; SameSite=Strict'
      )
    })
    it('expires', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { expires: 0 }),
        'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
      )
    })
    it('expires string', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { expires: '01 Jan 1970 00:00:00 GMT' }),
        'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
      )
    })
    it('expires Date', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', {
          expires: new Date('01 Jan 1970 00:00:00 GMT'),
        }),
        'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
      )
    })
    it('invalid expires', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { expires: 'foobar' }),
        'foo=bar; HttpOnly; SameSite=Strict'
      )
    })
    it('no httpOnly', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { httpOnly: false }),
        'foo=bar; SameSite=Strict'
      )
    })
    it('no httpOnly, no sameSite', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { httpOnly: false, sameSite: false }),
        'foo=bar'
      )
    })
    it('sameSite Lax', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { sameSite: 'Lax' }),
        'foo=bar; HttpOnly; SameSite=Lax'
      )
    })
  })
})
