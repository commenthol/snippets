/**
 * @typedef {{
 *  message: string
 *  path?: string[]
 * }} ValidationFailure
 */
/**
 * @typedef {(v: any, e?: ValidationFailure) => boolean} ValidationFn
 */

export const REQUIRED = Object.freeze({ required: true })

/**
 * @param {{
 *  required?: boolean
 *  validate?: (v: boolean, e?: ValidationFailure) => boolean
 * }} [opts]
 * @returns {ValidationFn}
 */
export const booleanT = (opts) => {
  const { required = false, validate } = opts || {}
  return (v, e = {}) => {
    if (!required && v === undefined) {
      return true
    }
    if (typeof v !== 'boolean') {
      e.message = 'not a boolean'
      return false
    }
    if (validate && !validate(v, e)) {
      e.message = e.message || 'boolean validate failed'
      return false
    }
    return true
  }
}

/**
 * @param {{
 *  required?: boolean
 *  min?: number
 *  max?: number
 *  validate?: (v: number, e?: ValidationFailure) => boolean
 * }} [opts]
 * @returns {ValidationFn}
 */
export const numberT = (opts) => {
  const {
    required = false,
    min = -Infinity,
    max = Infinity,
    validate,
  } = opts || {}
  if (min > max) {
    throw RangeError('min, max issue')
  }
  return (v, e = {}) => {
    if (!required && v === undefined) {
      return true
    }
    if (typeof v !== 'number') {
      e.message = 'not a number'
      return false
    }
    if (v < min) {
      e.message = `number less than min=${min}`
      return false
    }
    if (v >= max) {
      e.message = `number greater equal than max=${max}`
      return false
    }
    if (validate && !validate(v, e)) {
      e.message = e.message || 'number validate failed'
      return false
    }
    return true
  }
}

/**
 * @param {{
 *  required?: boolean
 *  min?: number
 *  max?: number
 *  validate?: (v: number, e?: ValidationFailure) => boolean
 * }} [opts]
 * @returns {ValidationFn}
 */
export const integerT = (opts) => {
  const { required = false } = opts || {}
  const numberF = numberT(opts)
  return (v, e = {}) => {
    if (!required && v === undefined) {
      return true
    }
    if (!numberF(v, e)) {
      return false
    }
    if (!Number.isSafeInteger(v)) {
      e.message = 'not an integer'
      return false
    }
    return true
  }
}

/**
 * @param {{
 *  required?: boolean
 *  min?: number
 *  max?: number
 *  pattern?: RegExp
 *  validate?: (v: string, e?: ValidationFailure) => boolean
 * }} [opts]
 * @returns {(v: any, e: ValidationFailure) => boolean}
 */
export const stringT = (opts) => {
  const { required = false, min = 0, max = 255, pattern, validate } = opts || {}
  if (min < 0 || max < 0 || min > max) {
    throw RangeError('min, max issue')
  }
  if (pattern && !(pattern instanceof RegExp)) {
    throw TypeError('pattern not a regex')
  }
  return (v, e = {}) => {
    if (!required && (v === undefined || v === '')) {
      return true
    }
    if (typeof v !== 'string') {
      e.message = 'not a string'
      return false
    }
    if (v.length < min) {
      e.message = `string too short min=${min}`
      return false
    }
    if (v.length > max) {
      e.message = `string too long max=${max}`
      return false
    }
    if (pattern && !pattern.test(v)) {
      e.message = `string does not match pattern=${pattern.source}`
      return false
    }
    if (validate && !validate(v, e)) {
      e.message = e.message || 'string validate failed'
      return false
    }
    return true
  }
}

/**
 * @param {string} string
 * @returns {boolean}
 */
export const validateUrl = (string, e = {}) => {
  try {
    return !!new URL(string)
  } catch (_err) {
    e.message = 'string is not an url'
    return false
  }
}

/**
 * @param {string} string
 * @param {ValidationFailure} [e]
 * @returns {boolean}
 */
export const validateDate = (string, e = {}) => {
  const d = new Date(string)
  if (isNaN(d.getTime())) {
    e.message = 'string is not a date'
    return false
  }
  return true
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * @param {string} string
 * @param {ValidationFailure} [e]
 * @returns {boolean}
 */
export const validateUuid = (string, e = {}) => {
  if (string.length !== 36 || !UUID_RE.test(string)) {
    e.message = 'string is not an uuid'
    return false
  }
  return true
}

/**
 * @param {any[]} list
 * @param {{
 *  required?: boolean
 * }} [opts ]
 * @returns {ValidationFn}
 */
export const enumT = (list, opts) => {
  const { required = false } = opts || {}
  if (!Array.isArray(list) || list.length === 0) {
    throw TypeError('array expected')
  }
  return (v, e = {}) => {
    if (!required && v === undefined) {
      return true
    }
    if (!list.includes(v)) {
      e.message = 'not an enum value'
      return false
    }
    return true
  }
}

/**
 * @param {ValidationFn} type
 * @param {{
 *  required?: boolean
 *  min?: number
 *  max?: number
 * }} [opts]
 * @returns {(v: any, e: ValidationFailure) => boolean}
 */
export const arrayT = (type, opts) => {
  const { required = false, min = 0, max = 255, validate } = opts || {}
  if (min < 0 || max < 0 || min > max) {
    throw RangeError('min, max issue')
  }
  if (typeof type !== 'function') {
    throw TypeError('function expected')
  }
  return (v, e = {}) => {
    if (!required && v === undefined) {
      return true
    }
    if (!Array.isArray(v)) {
      e.message = 'no an array'
      return false
    }
    if (v.length < min) {
      e.message = `array too short min=${min}`
      return false
    }
    if (v.length > max) {
      e.message = `array too long max=${max}`
      return false
    }
    for (let i = 0; i < v.length; i++) {
      const item = v[i]
      if (!type(item, e)) {
        e.path = [i, ...(e.path || [])]
        return false
      }
    }
    if (validate && !validate(v, e)) {
      e.message = e.message || 'array validate failed'
      return false
    }
    return true
  }
}

/**
 * @param {{[key: string]: ValidationFn}} schema
 * @param {{
 *  required?: boolean
 *  additionalProperties?: boolean
 *  validate?: (v: object, e?: ValidationFailure) => boolean
 * }} [opts]
 * @returns {ValidationFn}
 */
export const objectT = (schema, opts) => {
  const {
    required = false,
    additionalProperties = false,
    validate,
  } = opts || {}
  if (!schema || typeof schema !== 'object') {
    throw TypeError('schema object expected')
  }

  return (v, e = {}) => {
    if (!required && (v === undefined || v === null)) {
      return true
    }
    if (typeof v !== 'object') {
      e.message = 'not an object'
      return false
    }
    const vKeys = Object.keys(v)
    if (!additionalProperties) {
      for (const key of Object.keys(schema)) {
        if (!vKeys.includes(key) && !schema[key]()) {
          e.message = `object has missing key=${key}`
          return false
        }
      }
    }
    for (const key of vKeys) {
      if (additionalProperties && !(key in schema)) {
        continue
      }
      if (!schema[key]) {
        e.message = `object has additional key=${key}`
        return false
      }
      if (!schema[key](v[key], e)) {
        e.path = [key, ...(e.path || [])]
        return false
      }
    }
    if (validate && !validate(v, e)) {
      e.message = e.message || 'object validate failed'
      return false
    }
    return true
  }
}

/**
 * @param {ValidationFn[]} schemas
 * @returns {ValidationFn}
 */
export function oneOf(schemas) {
  if (!Array.isArray(schemas)) {
    throw TypeError('schema array expected')
  }

  return (v, e = {}) => {
    let matched = 0
    for (const schema of schemas) {
      if (schema(v)) {
        matched++
      }
    }
    if (matched === 1) {
      return true
    }
    e.message = `oneOf failed, matched=${matched}`
    return false
  }
}

/**
 * @param {ValidationFn[]} schemas
 * @returns {ValidationFn}
 */
export function anyOf(schemas) {
  if (!Array.isArray(schemas)) {
    throw TypeError('schema array expected')
  }

  return (v, e = {}) => {
    for (const one of schemas) {
      if (one(v)) {
        return true
      }
    }
    e.message = 'anyOf failed'
    return false
  }
}

export const validate = {
  boolean: booleanT,
  number: numberT,
  integer: integerT,
  string: stringT,
  enum: enumT,
  array: arrayT,
  object: objectT,
}
