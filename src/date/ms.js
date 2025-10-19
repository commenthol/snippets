const SECOND = 1e3
const MINUTE = 6e4
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const YEAR = 365.25 * DAY
const MONTH = Math.floor(YEAR / 12)

const RE = /^(-?[\d.]+)\s?(y|mo|w|d|h|m|s)?/

/**
 * convert human time string to milliseconds
 * e.g. "15minutes", "5h", "6days"
 * @param {number|string} [val]
 * @returns {number|undefined}
 */
export function ms(val) {
  if (typeof val === 'string') {
    const m = RE.exec(val.toLowerCase())
    if (!m) return
    const count = Number(m[1])
    const unit = m[2]
    const num =
      unit === 'y'
        ? YEAR
        : unit === 'mo'
          ? MONTH
          : unit === 'w'
            ? WEEK
            : unit === 'd'
              ? DAY
              : unit === 'h'
                ? HOUR
                : unit === 'm'
                  ? MINUTE
                  : unit === 's'
                    ? SECOND
                    : 1
    return count * num
  }
  return val
}

/**
 * convert milliseconds to human string
 * @param {number} ms
 * @param {boolean} [round=false] - round the resulting value to one fixed digit
 * @returns {string}
 */
export function msToString(ms, round = false) {
  if (typeof ms !== 'number') {
    throw new TypeError('ms needs to be a number')
  }
  let divider = 1
  let unit = ''
  const msAbs = Math.abs(ms)
  if (msAbs < SECOND) {
    // do nothing
  } else if (msAbs < MINUTE) {
    unit = 'seconds'
    divider = SECOND
  } else if (msAbs < HOUR) {
    unit = 'minutes'
    divider = MINUTE
  } else if (msAbs < DAY) {
    unit = 'hours'
    divider = HOUR
  } else if (msAbs < WEEK) {
    unit = 'days'
    divider = DAY
  } else if (msAbs < MONTH) {
    unit = 'weeks'
    divider = WEEK
  } else if (msAbs < YEAR) {
    unit = 'months'
    divider = MONTH
  } else {
    unit = 'years'
    divider = YEAR
  }

  const value = round ? (ms / divider).toFixed(1) : ms / divider
  if (value === 1) {
    unit = unit.slice(0, -1)
  }
  return `${value} ${unit}`.trim()
}
