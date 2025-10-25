import { STATUS_CODES } from 'http'

/**
 * @typedef {object} ErrorCause
 * @property {Error} [cause] error cause
 * @property {string} [code] represents the error code
 * @property {object} [info] object with details about the error condition, e.g. validation errors
 */

export class HttpError extends Error {
  /**
   * @param {number|string} [status=500]
   * @param {string} [message]
   * @param {Error|ErrorCause} [options]
   */
  constructor(status = 500, message = '', options = {}) {
    let cause
    message = message || STATUS_CODES[status] || String(status)
    if (options instanceof Error) {
      cause = options
      options = {}
    } else {
      cause = options?.cause
    }
    super(message, { cause })
    this.name = this.constructor.name
    this.status = isNaN(+status) ? 500 : status
    this.code = options.code
    this.info = options.info
  }
}
