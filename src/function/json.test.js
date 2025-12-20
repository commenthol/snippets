import assert from 'node:assert'
import { describe, it } from 'mocha'
import { jsonBigIntStringify, jsonBigIntDateParse } from './json.js'

describe('function/json', () => {
  describe('jsonBigIntStringify', () => {
    it('should stringify a BigInt with "n" suffix', () => {
      const result = jsonBigIntStringify(BigInt(12345678901234567890))
      assert.ok(typeof result === 'string')
      assert.ok(result.endsWith('n"'))
    })

    it('should handle the MAX_SAFE_INTEGER * 8 value', () => {
      const bigIntValue = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(8)
      const result = jsonBigIntStringify(bigIntValue)
      assert.equal(result, '"72057594037927928n"')
    })
  })

  describe('jsonBigIntDateParse', () => {
    it('should parse a stringified BigInt back to BigInt', () => {
      const result = jsonBigIntDateParse('"72057594037927928n"')
      assert.equal(typeof result, 'bigint')
      assert.strictEqual(result, BigInt(Number.MAX_SAFE_INTEGER) * BigInt(8))
    })

    it('should parse a stringified DateISOString back to Date', () => {
      const result = jsonBigIntDateParse('"2024-01-01T12:00:00.000Z"')
      assert.ok(result instanceof Date)
      assert.deepEqual(result, new Date('2024-01-01T12:00:00.000Z'))
    })
  })

  describe('round-trip serialization', () => {
    it('should preserve BigInt values through stringify and parse cycle', () => {
      const original = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(8)
      const stringified = jsonBigIntStringify(original)
      const parsed = jsonBigIntDateParse(stringified)
      assert.strictEqual(parsed, original)
    })

    it('should handle mixed object with BigInt and regular values', () => {
      const obj = {
        bigNum: BigInt('12345678901234567890'),
        str: 'hello',
        num: 42,
        bool: true,
        date: new Date('2024-01-01T12:00:00.000Z'),
      }
      const stringified = jsonBigIntStringify(obj)
      const parsed = jsonBigIntDateParse(stringified)
      assert.strictEqual(parsed.bigNum, BigInt('12345678901234567890'))
      assert.strictEqual(parsed.str, 'hello')
      assert.strictEqual(parsed.num, 42)
      assert.strictEqual(parsed.bool, true)
    })
  })
})
