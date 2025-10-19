/** ms ticks for max. date; 9999-12-31T23:59:59.999Z */
const MAX_TICKS_MS = 253402300799999

const DIGITS = '0123456789abcdef'
const hex = (byte) => DIGITS.charAt(byte >>> 4) + DIGITS.charAt(byte & 0xf)

/**
 * A UUID version 7 generator
 * @see https://www.rfc-editor.org/rfc/rfc9562
 * @param {number} [unixTsMs]
 * @param {{rollback: number}} [opts]
 * @returns {string}
 */
export function uuid7(unixTsMs = Date.now(), opts = {}) {
  const { rollback } = opts || 10e3
  if (unixTsMs < 0) throw new Error('min date 1970-01-01')
  if (unixTsMs > MAX_TICKS_MS) throw new Error('max date 9999-12-31')

  const rand = crypto.getRandomValues(new Uint8Array(10))
  if (
    unixTsMs > opts._lastTs ||
    unixTsMs + rollback < opts._lastTs ||
    !opts._count
  ) {
    opts._lastTs = unixTsMs
    opts._count = rand.slice(8)
  } else {
    // count up by one and deal with overflows
    if (opts._count[1] === 0xff) {
      opts._count[1] = 0
      opts._count[0] += 1
      if (opts._count[0] > 0xf) {
        opts._count[0] = 0
      }
    } else {
      opts._count[1] += 1
    }
  }

  const bytes = new Uint8Array(16)
  bytes[0] = unixTsMs / 2 ** 40
  bytes[1] = unixTsMs / 2 ** 32
  bytes[2] = unixTsMs / 2 ** 24
  bytes[3] = unixTsMs / 2 ** 16
  bytes[4] = unixTsMs / 2 ** 8
  bytes[5] = unixTsMs
  bytes[6] = 0x70 | (opts._count[0] & 0xf)
  bytes[7] = opts._count[1]
  bytes[8] = 0x80 | (rand[0] >>> 2)
  for (let i = 1; i < 8; i++) {
    bytes[8 + i] = rand[i]
  }

  let text = ''
  for (let i = 0; i < 16; i++) {
    text += hex(bytes[i])
    if ([3, 5, 7, 9].includes(i)) {
      text += '-'
    }
  }

  return text
}

/**
 * get the date from a UUIDv7
 * @param {string} uuidv7
 * @returns {Date} the date-time of the UUID
 */
export const uuid7date = (uuid) => {
  if (uuid[14] !== '7') throw new Error('not a UUIDv7')
  const ts = uuid.slice(0, 13).replace('-', '')
  const ticks = parseInt(ts, 16)
  return new Date(ticks)
}
