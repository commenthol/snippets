/**
 * SPDX-License-Identifier: Unlicense
 * @copyright commenthol (https://github.com/commenthol/snippets)
 * poor mans console logger with debug levels but no namespace filtering
 */

const debugLevel = (process.env.DEBUG_LEVEL || 'debug').toLowerCase()

const consoleL = (level, namespace) => {
  const line = `${level}:${namespace}`

  return (format, ...args) => {
    if (typeof format === 'string') {
      console[level](`${line} ${format}`, ...args)
    } else {
      console[level](line, format, ...args)
    }
  }
}

const noop = () => () => {}

const levels = ['log', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']

export const logger = (namespace) => {
  const l = {}
  let flag = false
  for (const level of levels) {
    if (flag) {
      l[level] = noop
      continue
    }
    l[level] = consoleL(level, namespace)
    if (level === debugLevel) {
      flag = true
    }
  }
  return l
}
