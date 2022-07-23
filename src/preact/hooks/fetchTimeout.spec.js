import { assert } from 'chai'
import { jsonify } from './fetchTimeout.js'

describe('preact/hooks', function () {
  describe('jsonify', function () {
    it('shall not add headers', function () {
      assert.deepStrictEqual(jsonify(), {})
    })

    it('shall not add default header for GET', function () {
      assert.deepStrictEqual(jsonify({ method: 'GET' }), { method: 'GET' })
    })

    it('shall add Content-Type for POST', function () {
      assert.deepStrictEqual(jsonify({
        method: 'POST',
        body: {}
      }), {
        method: 'POST',
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: '{}'
      })
    })

    it('shall add Content-Type for PUT', function () {
      assert.deepStrictEqual(jsonify({
        method: 'PUT',
        headers: { 'X-Custom': 'Custom header' },
        body: ['foo']
      }), {
        method: 'PUT',
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/json; charset=utf-8',
          'X-Custom': 'Custom header'
        },
        body: '["foo"]'
      })
    })

    it('shall add Content-Type for PATCH', function () {
      assert.deepStrictEqual(jsonify({
        method: 'PATCH',
        headers: { 'X-Custom': 'Custom header' },
        body: null
      }), {
        method: 'PATCH',
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/json; charset=utf-8',
          'X-Custom': 'Custom header'
        },
        body: 'null'
      })
    })
  })
})
