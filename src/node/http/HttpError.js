// const { STATUS_CODES } = require('http')
import { STATUS_CODES } from 'http'

/**
 * HttpError
 * @constructor
 * @param {String} code - error code
 * @param {Number} [status] - html status
 * @param {String|Error} [msg] - internal message
 */
export function HttpError (code = 'err_general', status = 500, msg) {
  const message = (msg) => `${code}: ${msg || STATUS_CODES[status] || status}`
  let err

  if (msg instanceof Error) {
    err = new Error(message(msg.message))
    err.stack = msg.stack
    err.name = msg.name
    err.status = msg.status || status
  } else {
    err = new Error(message(msg))
    err.name = 'HttpError'
    err.status = status
  }

  err.code = code
  return err
}

// module.exports = HttpError
export default HttpError
