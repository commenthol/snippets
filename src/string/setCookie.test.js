import assert from 'assert'
import sinon from 'sinon'
import { setCookieParse } from './setCookie.js'

describe('string/setCookieParse', function () {
  before(function () {
    this.clock = sinon.useFakeTimers()
  })
  after(function () {
    this.clock.restore()
  })

  it('shall parse set-cookie headers', function () {
    const headers = {
      'set-cookie': [
        'SESSION=abcdefg; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Path=/; Secure; HttpOnly',
        'qwerty=219ffwef9w0f; Domain=somecompany.co.uk; SameSite=Strict; Secure',
      ],
    }
    const actual = setCookieParse(headers['set-cookie'])
    assert.deepEqual(actual, {
      SESSION: {
        value: 'abcdefg',
        expires: new Date('2015-10-21T07:28:00.000Z'),
        path: '/',
        secure: true,
        httpOnly: true,
      },
      qwerty: {
        value: '219ffwef9w0f',
        domain: 'somecompany.co.uk',
        sameSite: 'Strict',
        secure: true,
      },
    })
  })

  it('max-age has precedence over expires', function () {
    const setCookieHeader = [
      'one=first; max-age=10; expires=Thu, 11 Apr 2024 04:13:18 GMT',
      'two=second; expires=Thu, 11 Apr 2024 04:13:18 GMT; max-age=10',
    ]
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, {
      one: { value: 'first', expires: new Date('1970-01-01T00:00:10.000Z') },
      two: { value: 'second', expires: new Date('1970-01-01T00:00:10.000Z') },
    })
  })

  it('shall not parse cookiename with unallowed characters', function () {
    const setCookieHeader =
      'o<>ne=first; max-age=10; expires=Thu, 11 Apr 2024 04:13:18 GMT'
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, {})
  })

  it('shall not parse wrong encoded cookievalue', function () {
    const setCookieHeader = ['name=va%lue']
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, {})
  })

  it('shall remove optional double quotes', function () {
    const setCookieHeader = ['name="val ue"']
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, { name: { value: 'val ue' } })
  })

  it('shall ignore path not starting with /', function () {
    const setCookieHeader = ['name=value; path=my-path']
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, { name: { value: 'value' } })
  })

  it('shall ignore expire not being of type date', function () {
    const setCookieHeader = ['name=value; expires=Not a date']
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, { name: { value: 'value' } })
  })

  it('shall ignore max-age not being of type number', function () {
    const setCookieHeader = ['name=value; max-age=num']
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, { name: { value: 'value' } })
  })

  it('shall ignore SameSite', function () {
    const setCookieHeader = ['name=value; SameSite=Hi', 'fail=safe ; SameSite=']
    const actual = setCookieParse(setCookieHeader)
    assert.deepEqual(actual, {
      name: { value: 'value' },
      fail: { value: 'safe ' },
    })
  })
})
