import assert from 'node:assert'
import { describe, it } from 'mocha'
import * as v from './validate.js'

describe('function/validate', () => {
  describe('Core Functions', () => {
    it('parse - valid input', () => {
      const result = v.parse(v.number(), 42)
      assert.strictEqual(result, 42)
    })

    it('parse - invalid input throws error', () => {
      assert.throws(() => v.parse(v.number(), 'not a number'), Error)
    })

    it('safeParse - valid input', () => {
      const result = v.safeParse(v.number(), 42)
      assert.strictEqual(result.success, true)
      assert.strictEqual(result.output, 42)
      assert.strictEqual(result.issue, null)
    })

    it('safeParse - invalid input', () => {
      const result = v.safeParse(v.number(), 'not a number')
      assert.strictEqual(result.success, false)
      assert.ok(result.issue instanceof Error)
      assert.equal(result.issue.message, 'not a number')
      assert.equal(result.output, undefined)
    })

    it('pipe - all validations pass', () => {
      const schema = v.pipe(v.number(), v.minValue(10), v.maxValue(100))
      const result = schema(50)
      assert.strictEqual(result.ok, true)
    })

    it('pipe - validation fails at first step', () => {
      const schema = v.pipe(v.number(), v.minValue(10))
      const result = schema('not a number')
      assert.strictEqual(result.ok, false)
    })

    it('pipe - validation fails at second step', () => {
      const schema = v.pipe(v.number(), v.minValue(10))
      const result = schema(5)
      assert.strictEqual(result.ok, false)
    })

    it('optional - with undefined', () => {
      const schema = v.optional(v.number())
      const result = schema(undefined)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, undefined)
    })

    it('optional - with value', () => {
      const schema = v.optional(v.number())
      const result = schema(42)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, 42)
    })

    it('optional - with invalid value', () => {
      const schema = v.optional(v.number())
      const result = schema('invalid')
      assert.strictEqual(result.ok, false)
    })

    it('nullable - with null', () => {
      const schema = v.nullable(v.number())
      const result = schema(null)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, null)
    })

    it('nullable - with value', () => {
      const schema = v.nullable(v.number())
      const result = schema(42)
      assert.strictEqual(result.ok, true)
    })

    it('transform - transforms value', () => {
      const schema = v.transform((v_) => v_ * 2)
      const result = schema(21)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, 42)
    })

    it('union - first schema matches', () => {
      const schema = v.union([v.string(), v.number()])
      const result = schema('hello')
      assert.strictEqual(result.ok, true)
    })

    it('union - second schema matches', () => {
      const schema = v.union([v.string(), v.number()])
      const result = schema(42)
      assert.strictEqual(result.ok, true)
    })

    it('union - no schema matches', () => {
      const schema = v.union([v.string(), v.number()])
      const result = schema(true)
      assert.strictEqual(result.ok, false)
      assert(result.msg.includes('no union match'))
    })

    it('union - throws if not array', () => {
      // @ts-expect-error
      assert.throws(() => v.union('not array'), TypeError)
    })

    it('intersection - all schemas match', () => {
      const schema = v.intersection([
        (v_) => ({ ok: v_ > 0, msg: 'must be positive' }),
        (v_) => ({ ok: v_ < 100, msg: 'must be less than 100' }),
      ])
      const result = schema(50)
      assert.strictEqual(result.ok, true)
    })

    it('intersection - one schema fails', () => {
      const schema = v.intersection([
        (v_) => ({ ok: v_ > 0, msg: 'must be positive' }),
        (v_) => ({ ok: v_ < 100, msg: 'must be less than 100' }),
      ])
      const result = schema(150)
      assert.strictEqual(result.ok, false)
    })

    it('intersection - throws if not array', () => {
      // @ts-expect-error
      assert.throws(() => v.intersection('not array'), TypeError)
    })
  })

  // === Boolean validators ===

  describe('Boolean Validators', () => {
    it('boolean - valid true', () => {
      const result = v.boolean()(true)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, true)
    })

    it('boolean - valid false', () => {
      const result = v.boolean()(false)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, false)
    })

    it('boolean - invalid number', () => {
      const result = v.boolean()(1)
      assert.strictEqual(result.ok, false)
    })

    it('boolean - invalid string', () => {
      const result = v.boolean()('true')
      assert.strictEqual(result.ok, false)
    })

    it('boolean - custom message', () => {
      const result = v.boolean('custom error')(null)
      assert.strictEqual(result.ok, false)
      assert.strictEqual(result.msg, 'custom error')
    })
  })

  // === Number validators ===

  describe('Number Validators', () => {
    it('number - valid integer', () => {
      const result = v.number()(42)
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, 42)
    })

    it('number - valid float', () => {
      const result = v.number()(3.14)
      assert.strictEqual(result.ok, true)
    })

    it('number - valid zero', () => {
      const result = v.number()(0)
      assert.strictEqual(result.ok, true)
    })

    it('number - invalid string', () => {
      const result = v.number()('42')
      assert.strictEqual(result.ok, false)
    })

    it('number - invalid NaN', () => {
      const result = v.number()(NaN)
      assert.strictEqual(result.ok, false)
    })

    it('integer - valid integer', () => {
      const result = v.integer()(42)
      assert.strictEqual(result.ok, true)
    })

    it('integer - invalid float', () => {
      const result = v.integer()(3.14)
      assert.strictEqual(result.ok, false)
    })

    it('integer - invalid string', () => {
      const result = v.integer()('42')
      assert.strictEqual(result.ok, false)
    })

    it('value - matching value', () => {
      const result = v.pipe(v.number(), v.value(42))(42)
      assert.strictEqual(result.ok, true)
    })

    it('value - non-matching value', () => {
      const result = v.pipe(v.number(), v.value(42))(43)
      assert.strictEqual(result.ok, false)
    })

    it('value - throws on invalid value', () => {
      // @ts-expect-error
      assert.throws(() => v.value('not a number'), TypeError)
    })

    it('notValue - different value', () => {
      const result = v.pipe(v.number(), v.notValue(42))(43)
      assert.strictEqual(result.ok, true)
    })

    it('notValue - same value', () => {
      const result = v.pipe(v.number(), v.notValue(42))(42)
      assert.strictEqual(result.ok, false)
    })

    it('notValue - throws on invalid value', () => {
      // @ts-expect-error
      assert.throws(() => v.notValue('not a number'), TypeError)
    })

    it('minValue - throws on invalid value', () => {
      // @ts-expect-error
      assert.throws(() => v.minValue('not a number'), TypeError)
    })

    it('maxValue - throws on invalid value', () => {
      // @ts-expect-error
      assert.throws(() => v.maxValue('not a number'), TypeError)
    })

    it('minValue - valid value', () => {
      const result = v.pipe(v.number(), v.minValue(10))(20)
      assert.strictEqual(result.ok, true)
    })

    it('minValue - invalid value', () => {
      const result = v.pipe(v.number(), v.minValue(10))(5)
      assert.strictEqual(result.ok, false)
    })

    it('maxValue - valid value', () => {
      const result = v.pipe(v.number(), v.maxValue(100))(50)
      assert.strictEqual(result.ok, true)
    })

    it('maxValue - invalid value', () => {
      const result = v.pipe(v.number(), v.maxValue(100))(150)
      assert.strictEqual(result.ok, false)
    })
  })

  // === String validators ===

  describe('String Validators', () => {
    it('string - valid string', () => {
      const result = v.string()('hello')
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, 'hello')
    })

    it('string - empty string', () => {
      const result = v.string()('')
      assert.strictEqual(result.ok, true)
    })

    it('string - invalid number', () => {
      const result = v.string()(42)
      assert.strictEqual(result.ok, false)
    })

    it('string - invalid null', () => {
      const result = v.string()(null)
      assert.strictEqual(result.ok, false)
    })

    it('length - throws on invalid length', () => {
      // @ts-expect-error
      assert.throws(() => v.length('not a number'), TypeError)
    })

    it('maxLength - throws on invalid length', () => {
      // @ts-expect-error
      assert.throws(() => v.maxLength('not a number'), TypeError)
    })

    it('minLength - throws on invalid length', () => {
      // @ts-expect-error
      assert.throws(() => v.minLength('not a number'), TypeError)
    })

    it('nonEmpty - non-empty string', () => {
      const result = v.pipe(v.string(), v.nonEmpty())('hello')
      assert.strictEqual(result.ok, true)
    })

    it('nonEmpty - empty string', () => {
      const result = v.pipe(v.string(), v.nonEmpty())('')
      assert.strictEqual(result.ok, false)
    })

    it('url - valid url', () => {
      const result = v.pipe(v.string(), v.url())('https://example.com')
      assert.strictEqual(result.ok, true)
    })

    it('url - invalid url', () => {
      const result = v.pipe(v.string(), v.url())('not a url')
      assert.strictEqual(result.ok, false)
    })

    it('uuid - valid uuid v4', () => {
      const result = v.pipe(
        v.string(),
        v.uuid()
      )('550e8400-e29b-41d4-a716-446655440000')
      assert.strictEqual(result.ok, true)
    })

    it('uuid - invalid uuid', () => {
      const result = v.pipe(v.string(), v.uuid())('not-a-uuid')
      assert.strictEqual(result.ok, false)
    })

    it('uuid - empty string', () => {
      const result = v.pipe(v.string(), v.uuid())('')
      assert.strictEqual(result.ok, false)
    })
  })
  // === Enum validators ===

  describe('Enum Validators', () => {
    it('picklist - valid string value', () => {
      const result = v.pipe(
        v.string(),
        v.picklist(['red', 'green', 'blue'])
      )('red')
      assert.strictEqual(result.ok, true)
    })

    it('picklist - valid number value', () => {
      const result = v.pipe(v.number(), v.picklist([1, 2, 3]))(2)
      assert.strictEqual(result.ok, true)
    })

    it('picklist - invalid value', () => {
      const result = v.pipe(
        v.string(),
        v.picklist(['red', 'green', 'blue'])
      )('yellow')
      assert.strictEqual(result.ok, false)
    })

    it('picklist - throws if not array', () => {
      assert.throws(() => v.picklist('not array'), TypeError)
    })
  })

  // === Array validators ===

  describe('Array Validators', () => {
    it('array - valid with item schema', () => {
      const result = v.array(v.number())([1, 2, 3])
      assert.strictEqual(result.ok, true)
    })

    it('array - invalid with item schema', () => {
      const result = v.array(v.number())([1, 'two', 3])
      assert.strictEqual(result.ok, false)
    })

    it('array - empty array', () => {
      const result = v.array(v.number())([])
      assert.strictEqual(result.ok, true)
    })

    it('array - not an array', () => {
      const result = v.array(v.number())('not array')
      assert.strictEqual(result.ok, false)
    })

    it('includes - array includes value', () => {
      const result = v.pipe(v.array(v.number()), v.includes(42))([1, 42, 3])
      assert.strictEqual(result.ok, true)
    })

    it('includes - array does not include value', () => {
      const result = v.pipe(v.array(v.number()), v.includes(42))([1, 2, 3])
      assert.strictEqual(result.ok, false)
    })

    it('excludes - array excludes value', () => {
      const result = v.pipe(v.array(v.number()), v.excludes(42))([1, 2, 3])
      assert.strictEqual(result.ok, true)
    })

    it('excludes - array includes value', () => {
      const result = v.pipe(v.array(v.number()), v.excludes(42))([1, 42, 3])
      assert.strictEqual(result.ok, false)
    })
  })

  // === Object validators ===

  describe('Object Validators', () => {
    it('object - valid object', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      })
      const result = schema({ name: 'John', age: 30 })
      assert.strictEqual(result.ok, true)
    })

    it('object - valid object optional property', () => {
      const schema = v.object({
        name: v.string(),
        age: v.optional(v.number()),
      })
      const result = schema({ name: 'John' })
      assert.strictEqual(result.ok, true)
      {
        const result = schema({})
        assert.strictEqual(result.ok, false)
        assert.strictEqual(result.msg.includes('name'), true)
      }
    })

    it('object - invalid property', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      })
      const result = schema({ name: 'John', age: 'thirty' })
      assert.strictEqual(result.ok, false)
      assert(result.msg.includes('age'))
    })

    it('object - not an object', () => {
      const schema = v.object({ name: v.string() })
      const result = schema('not an object')
      assert.strictEqual(result.ok, false)
    })

    it('object - null value', () => {
      const schema = v.object({ name: v.string() })
      const result = schema(null)
      assert.strictEqual(result.ok, false)
    })

    it('object - array value', () => {
      const schema = v.object({ name: v.string() })
      const result = schema([])
      assert.strictEqual(result.ok, false)
    })

    it('object - throws if schema not object', () => {
      // @ts-expect-error
      assert.throws(() => v.object('not object'), TypeError)
    })

    it('object - throws if schema is array', () => {
      assert.throws(() => v.object([]), TypeError)
    })

    it('object - throws if schema is null', () => {
      // @ts-expect-error
      assert.throws(() => v.object(null), TypeError)
    })

    it('object - has entries property', () => {
      const schema = v.object({ name: v.string() })
      assert(schema.entries)
      assert.strictEqual(typeof schema.entries, 'object')
    })

    it('object - nested object', () => {
      const schema = v.object({
        user: v.object({
          bool: v.optional(v.boolean()),
          name: v.string(),
          age: v.number(),
        }),
      })
      const result = schema({
        user: { name: 'John', age: 30 },
      })
      assert.strictEqual(result.ok, true)
    })

    it('object - nested object invalid', () => {
      const schema = v.object({
        user: v.object({
          name: v.string(),
          age: v.number(),
        }),
      })
      const result = schema({
        user: { name: 'John', age: 'thirty' },
      })
      assert.strictEqual(result.ok, false)
    })
  })

  // === Complex scenarios ===

  describe('Complex Scenarios', () => {
    it('complex - optional nullable string', () => {
      const schema = v.optional(v.nullable(v.string()))
      assert.strictEqual(schema(undefined).ok, true)
      assert.strictEqual(schema(null).ok, true)
      assert.strictEqual(schema('hello').ok, true)
      assert.strictEqual(schema(42).ok, false)
    })

    it('complex - array of objects', () => {
      const itemSchema = (v_) =>
        v.object({
          id: v.number(),
          name: v.string(),
        })(v_)
      const schema = v.array(itemSchema)
      const result = schema([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ])
      assert.strictEqual(result.ok, true)
    })

    it('complex - transform with pipe', () => {
      const schema = v.pipe(
        v.string(),
        v.transform((v_) => v_.toUpperCase()),
        v.transform((v_) => v_ + '!')
      )
      const result = schema('hello')
      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.v, 'HELLO!')
    })
  })
})
