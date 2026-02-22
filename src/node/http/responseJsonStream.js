/** @typedef {import('http').OutgoingMessage} OutgoingMessage */

/**
 * @throws {Error} if no array key is found in the object
 * @param {object} obj
 * @returns {string}
 */
const findArrayKey = (obj) => {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      return key
    }
  }
  throw new Error('No array key found in object')
}

/**
 * @typedef {object} ResponseJsonStreamOptions
 * @property {Record<string, string|number|boolean|object|any[]>} [obj] object
 * to write as first chunk
 * @property {string} [arrayKey] key of the array in the object to write as
 * first chunk, if not provided it will be auto detected
 */

/**
 * Utility class to write JSON objects as a stream to the response. It writes
 * the objects as an array, so the client can parse it as a stream of JSON
 * objects.
 * @example
 * const stream = new ResponseJsonStream(res, { obj: { total: 100, items: [] }, arrayKey: 'items' })
 * stream.write({ id: 1, name: 'Alice' })
 * stream.write({ id: 2, name: 'Bob' })
 * stream.end()
 */
export class ResponseJsonStream {
  _first = true

  /**
   * @param {OutgoingMessage} res
   * @param {ResponseJsonStreamOptions} [options] object to write as first chunk
   */
  constructor(res, options) {
    this._res = res
    this._res.setHeader('Content-Type', 'application/json')
    this._res.setHeader('Transfer-Encoding', 'chunked')
    let { obj, arrayKey } = options || {}
    this._hasObj = !!obj
    let start = '['

    if (this._hasObj && !arrayKey) {
      arrayKey = findArrayKey(obj)
    }
    if (this._hasObj) {
      const head = {}
      for (const key in obj) {
        if (key !== arrayKey) {
          head[key] = obj[key]
        }
      }
      start = JSON.stringify(head).slice(0, -1) + ',"' + arrayKey + '":['
    }

    this._res.write(start)
    if (obj && arrayKey && obj[arrayKey]?.length > 0) {
      for (const item of obj[arrayKey]) {
        this.write(item)
      }
    }
  }

  write(obj) {
    const sep = this._first ? '' : ','
    this._first = false
    const json = sep + JSON.stringify(obj)
    this._res.write(json)
  }

  end() {
    const end = this._hasObj ? '}' : ''
    this._res.end(']' + end)
  }
}
