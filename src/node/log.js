import debug from 'debug'

/**
 * @typedef {object} Log
 * @property {function(string, ...any):void} debug
 * @property {function(string, ...any):void} info
 * @property {function(string, ...any):void} warn
 * @property {function(string, ...any):void} error
 */

/// with console
/**
 * @type {Log}
 */
// @ts-expect-error
export const log = ['debug', 'info', 'warn', 'error'].reduce(
  (o, level) => ({
    ...o,
    [level]: (arg, ...args) => {
      if (typeof arg === 'string') {
        arg = `${level.toUpperCase()}: ${arg}`
      }
      console[level](arg, ...args)
    },
  }),
  {}
)
/// disable some levels
// log.debug = () => {}

/// using debug
// const debug = require('debug')
/**
 * @type {Log}
 */
// @ts-expect-error
export const logd = ['debug', 'info', 'warn', 'error'].reduce(
  (o, level) => ({ ...o, [level]: debug(`${level}:docker`) }),
  {}
)
