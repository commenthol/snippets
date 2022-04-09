const SECOND = 1e3
const MINUTE = 6e4
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const YEAR = 365.25 * DAY
const MONTH = Math.floor(YEAR / 12)

const RE = /^(-?[\d.]+)\s?(y|mo|d|h|m|s)?/

export function ms (val) {
  if (typeof val === 'string') {
    const m = RE.exec(val.toLowerCase())
    if (!m) return
    const count = Number(m[1])
    const unit = m[2]
    const num = unit === 'y'
      ? YEAR
      : unit === 'mo'
        ? MONTH
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
