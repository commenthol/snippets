const RE = /^([\d.]+)\s?(b|k|m|g|t|p)?/

const units = {
  k: 2 ** 10,
  m: 2 ** 20,
  g: 2 ** 30,
  t: 2 ** 40,
  p: 2 ** 50
}

/**
 * convert string to byte value
 *
 * - b for bytes
 * - kB for kilobytes
 * - MB for megabytes
 * - GB for gigabytes
 * - TB for terabytes
 * - PB for petabytes
 * @param {string|number|undefined} val
 * @returns {number|undefined}
 * @example
 * bytes('100kB') = 102400
 * bytes('2.5MB') = 2621440
 */
export function bytes (val) {
  if (typeof val === 'number') {
    return val
  }
  if (typeof val === 'string') {
    const m = RE.exec(val.toLowerCase())
    if (!m) return
    const count = Number(m[1])
    const unit = m[2]
    const num =
      unit === 'p'
        ? units.p
        : unit === 't'
          ? units.t
          : unit === 'g'
            ? units.g
            : unit === 'm'
              ? units.m
              : unit === 'k'
                ? units.k
                : 1
    return Math.floor(count * num)
  }
}

/**
 * convert bytes to human string
 * @param {number} bytes
 * @param {boolean} [round=false] - round the resulting value to one fixed digit
 * @returns {string}
 */
export function bytesToString (bytes, round) {
  if (typeof bytes !== 'number') {
    throw new TypeError('bytes needs to be a number')
  }
  let unit = ''
  let divider = 1
  if (bytes < units.k) {
    // do nothing
  } else if (bytes < units.m) {
    unit = 'kB'
    divider = units.k
  } else if (bytes < units.g) {
    unit = 'MB'
    divider = units.m
  } else if (bytes < units.t) {
    unit = 'GB'
    divider = units.g
  } else if (bytes < units.p) {
    unit = 'TB'
    divider = units.t
  } else {
    unit = 'PB'
    divider = units.p
  }
  const value = round ? (bytes / divider).toFixed(1) : bytes / divider
  return `${value}${unit}`
}
