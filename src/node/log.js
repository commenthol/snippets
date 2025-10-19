import debug from 'debug'

/// with console
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
// log.debug = () => { }

/// using debug
// const debug = require('debug')
export const logd = ['debug', 'info', 'warn', 'error'].reduce(
  (o, level) => ({ ...o, [level]: debug(`${level}:docker`) }),
  {}
)
