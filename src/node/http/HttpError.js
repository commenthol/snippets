import { STATUS_CODES } from 'http'

export class HttpError extends Error {
  /**
   * HttpError
   * @constructor
   * @param {Number|String|Error} status - http status response code
   * @param {String|Error} [message] - error message
   * @param {Error} [error] - error which needs forwarding
   */
  constructor (status = 500, message, error) {
    if (typeof status === 'string' || status instanceof Error) {
      message = status
      status = 500
    }
    if (message instanceof Error) {
      error = message
      message = error.message
    }

    const msg = message || STATUS_CODES[status] || status

    super(msg)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError)
    }

    this.name = 'HttpError'
    this.status = status

    if (error instanceof Error) {
      // add error type and message to stacktrace (msg may be duplicated)
      this.stack = `${this.name}: ${msg} :: ` + error.stack
    }
  }
}
