/**
 * valibot inspired validation functions
 * @see https://valibot.dev/
 */

/**
 * types
 */
const TYPE = {
  boolean: 'boolean',
  number: 'number',
  string: 'string',
  array: 'array',
  object: 'object',
}

/**
 * @typedef {keyof typeof TYPE} TypeKey
 * @typedef {(typeof TYPE)[TypeKey]} TypeValue
 */

/**
 * @template T
 * @typedef {object} TResult<T>
 * @prop {TypeValue} [type]
 * @prop {boolean} ok
 * @prop {string} msg
 * @prop {T} [v]
 */

/**
 * @template T
 * @typedef {<T>(v: any) => TResult<T>} TSchema
 */

/**
 * @template T
 * @typedef {<T>(v: any, o: {type?: TypeValue}) => TResult<T>} TItem
 */

/**
 * @template T
 * @typedef {T extends TSchema<infer U> ? U : never} InferOutput
 */

/**
 * @template T extends {[key: string]: TSchema<any>}
 * @typedef {{[K in keyof T]: InferOutput<T[K]>}} InferObjectOutput
 */

/**
 * @template T
 * @param {TSchema<T>} schema
 * @param {any} v
 * @returns {T}
 */
export const parse = (schema, v) => {
  const { ok, msg, v: _v } = schema(v)
  if (!ok) {
    throw Error(msg)
  }
  return _v
}

/**
 * @template T
 * @param {TSchema<T>} schema
 * @param {any} v
 * @returns {{success: boolean, issue: Error|null, output?: T}}
 */
export const safeParse = (schema, v) => {
  const { ok: success, msg, v: output } = schema(v)
  let issue = null
  if (!success) {
    issue = new Error(msg)
  }
  return { success, issue, output }
}

/**
 * @template T
 * @param {TSchema<T>} schema
 * @param  {...TItem<T>} items
 */
export const pipe =
  (schema, ...items) =>
  (v) => {
    let o = schema(v)
    if (!o.ok) {
      return o
    }
    let result = o
    for (const item of items) {
      result = item(result.v, o)
      if (!result.ok) {
        return result
      }
    }
    return result
  }

/**
 * @template T
 * @param {TSchema<T>} schema
 */
export const optional = (schema) => (v) => {
  if (v === undefined) {
    return { ok: true, v, msg: '' }
  }
  return schema(v)
}

/**
 * @template T
 * @param {TSchema<T>} schema
 */
export const nullable = (schema) => (v) => {
  if (v === null) {
    return { ok: true, v, msg: '' }
  }
  return schema(v)
}

/**
 * @template T extends T | undefined
 * @param {(v: any) => T} fn
 * @returns {TSchema<T>}
 */
export const transform = (fn) => {
  if (typeof fn !== 'function') {
    throw TypeError('function expected')
  }
  return (v) => ({
    type: undefined,
    ok: true,
    v: fn(v),
    msg: '',
  })
}

/**
 * @template T
 * @param {TSchema<T>[]} schemas
 */
export const union = (schemas) => {
  if (!Array.isArray(schemas)) {
    throw TypeError('schemas must be an array')
  }
  return (v) => {
    let errors = []
    for (const schema of schemas) {
      let o = schema(v)
      if (o.ok) {
        return o
      } else {
        errors.push(o.msg)
      }
    }
    return {
      ok: false,
      msg: `no union match: ${errors.join('; ')}`,
    }
  }
}

/**
 * @template T
 * @param {TSchema<T>[]} schemas
 */
export const intersection = (schemas) => {
  if (!Array.isArray(schemas)) {
    throw TypeError('schemas must be an array')
  }
  return (v) => {
    for (const schema of schemas) {
      let o = schema(v)
      if (!o.ok) {
        return o
      }
    }
    return {
      ok: true,
      v,
    }
  }
}

// === helper

/**
 * @param {any} v
 * @returns {boolean is number}
 */
const isNumber = (v) => {
  const n = +v
  return n - n === 0
}

const safeExec = (fn, v) => {
  try {
    return fn(v)
  } catch (_err) {
    return false
  }
}

/**
 * @private
 * @template T
 * @param {TResult<T>} o
 * @returns {TResult<T>}
 */
const check = (o) => ({
  type: o.type,
  ok: o.ok,
  msg: o.ok ? '' : o.msg,
  v: o.ok ? o.v : undefined,
})

// === booleans

/**
 * @template T as boolean
 * @param {string} [msg]
 * @returns {TSchema<T>}
 */
export const boolean =
  (msg = 'not a boolean') =>
  (v) =>
    check({
      type: TYPE.boolean,
      ok: typeof v === 'boolean',
      msg,
      v,
    })

// === numbers

/**
 * @throws {TypeError}
 * @param {any} value
 * @return {asserts value is number}
 */
const assertNumber = (value) => {
  if (!isNumber(value)) {
    throw TypeError('value must be a number')
  }
}

/**
 * @template T as number
 * @param {string} [msg]
 * @returns {TSchema<T>}
 */
export const number =
  (msg = 'not a number') =>
  (v) =>
    check({
      type: TYPE.number,
      ok: typeof v === 'number' && !isNaN(v),
      msg,
      v,
    })

/**
 * @template T as number
 * @param {string} [msg]
 * @returns {TSchema<T>}
 */
export const integer =
  (msg = 'not an integer') =>
  (v) =>
    check({
      type: TYPE.number,
      ok: Number.isSafeInteger(v),
      msg,
      v,
    })

/**
 * @template T as number
 * @param {number} value
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const value = (value, msg = 'invalid number') => {
  assertNumber(value)
  return (v, { type }) =>
    check({
      type,
      ok: type === TYPE.number && v === value,
      msg,
      v,
    })
}

/**
 * @template T as number
 * @param {number} value
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const notValue = (value, msg = 'invalid number') => {
  assertNumber(value)
  return (v, { type }) =>
    check({
      type,
      ok: type === TYPE.number && v !== value,
      msg,
      v,
    })
}

/**
 * @template T as number
 * @param {number} value
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const minValue = (value, msg = 'number too small') => {
  assertNumber(value)
  return (v, { type }) =>
    check({
      type,
      ok: type === TYPE.number && v > value,
      msg,
      v,
    })
}

/**
 * @template T as number
 * @param {number} value
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const maxValue = (value, msg = 'number too large') => {
  assertNumber(value)
  return (v, { type }) =>
    check({
      type,
      ok: type === TYPE.number && v < value,
      msg,
      v,
    })
}

// === strings

const isArrayOrStringType = (type) => [TYPE.string, TYPE.array].includes(type)

/**
 * @template T as string
 * @param {string} [msg]
 * @returns {TSchema<T>}
 */
export const string =
  (msg = 'not a string') =>
  (v) =>
    check({
      type: TYPE.string,
      ok: typeof v === 'string',
      msg,
      v,
    })

/**
 * @template T as Array<U>|string
 * @param {number} len
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const length = (len, msg = 'invalid length') => {
  assertNumber(len)
  return (v, { type }) =>
    check({
      type,
      ok: isArrayOrStringType(type) && v?.length === len,
      msg,
      v,
    })
}

/**
 * @template T as Array<U>|string
 * @param {number} len
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const maxLength = (len, msg = 'maxLength exceeded') => {
  assertNumber(len)
  return (v, { type }) =>
    check({
      type,
      ok: isArrayOrStringType(type) && v?.length < len,
      msg,
      v,
    })
}

/**
 * @template T as Array<U>|string
 * @param {number} len
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const minLength = (len, msg = 'minLength too short') => {
  assertNumber(len)
  return (v, { type }) =>
    check({
      type,
      ok: isArrayOrStringType(type) && v?.length > len,
      msg,
      v,
    })
}

/**
 * @template T as Array<U>|string
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const nonEmpty =
  (msg = 'empty string') =>
  (v, { type }) =>
    check({
      type,
      ok: isArrayOrStringType(type) && v?.length !== 0,
      msg,
      v,
    })

const isUrl = (v) => !!new URL(v)

/**
 * @template T as string
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const url =
  (msg = 'not an url') =>
  (v, { type }) =>
    check({
      type,
      ok: type === TYPE.string && safeExec(isUrl, v),
      msg,
      v,
    })

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * @template T as string
 * @param {string} [msg]
 * @returns {TItem<T>}
 */
export const uuid =
  (msg = 'not an uuid') =>
  (v, { type }) =>
    check({
      type,
      ok: type === TYPE.string && uuidRegex.test(v),
      msg,
      v,
    })

// === enums

/**
 * @template T as string[]|number[]
 * @param {T} values
 * @param {string} [msg]
 * @returns {TSchema<T>}
 */
export const picklist = (values, msg = 'invalid value') => {
  if (!Array.isArray(values)) {
    throw TypeError('picklist values must be an array')
  }
  return (v, { type }) =>
    check({
      type,
      ok: (type === TYPE.string || type === TYPE.number) && values.includes(v),
      msg,
      v,
    })
}

// === arrays

/**
 * @template T
 * @param {TSchema<T>} schema
 * @param {string} [msg]
 */
export const array =
  (schema, msg = 'not an array') =>
  /**
   * @param {any} v
   * @returns {TResult<T['type']>}
   */
  (v) => {
    const ok = Array.isArray(v) && v.every((item) => schema(item).ok)
    return check({
      type: TYPE.array,
      ok,
      msg,
      v,
    })
  }

/**
 * @template T
 * @param {T} value
 * @param {string} [msg]
 * @returns {TItem<T['type']>}
 */
export const includes =
  (value, msg = 'array does not include value') =>
  (v, { type }) =>
    check({
      type,
      ok: type === TYPE.array && v.includes(value),
      msg,
      v,
    })

/**
 * @template T
 * @param {T} value
 * @param {string} [msg]
 * @returns {TItem<T['type']>}
 */
export const excludes =
  (value, msg = 'array includes value') =>
  (v, { type }) =>
    check({
      type,
      ok: type === TYPE.array && !v.includes(value),
      msg,
      v,
    })

// === objects

/**
 * @param {any} v
 * @returns {boolean is object}
 */
const isObject = (v) => {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/**
 * @template T extends object
 * @param {{[K in keyof T]: TSchema<T[K]>}} schema
 * @param {string} [msg]
 * @returns {TSchema<T>}
 */
export const object = (schema, msg = 'not an object') => {
  if (!isObject(schema)) {
    throw TypeError('schema must be an object')
  }
  let fn = (v) => {
    if (!isObject(v)) {
      return check({ type: TYPE.object, ok: false, msg })
    }
    for (const [k, propSchema] of Object.entries(schema)) {
      const result = propSchema(v[k])
      if (!result.ok) {
        return check({
          type: TYPE.object,
          ok: false,
          msg: `property "${k}": ${result.msg}`,
        })
      }
    }
    return check({
      type: TYPE.object,
      ok: true,
      msg,
      v,
    })
  }
  fn.entries = schema
  return fn
}
