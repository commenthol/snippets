import { webcrypto as crypto } from 'node:crypto'

/** ms ticks since start of gregorian calendar; 1582-10-15T00:00:00Z */
const GREGORIAN_EPOCH_TICKS = 12219292800000
/** ms ticks for max. date; 9999-12-31T23:59:59.999Z */
const MAX_TICKS_MS = 253402300799999
/** uuid template */
const TMPL = '00000000-0000-7000-0000-000000000000'

/**
 * UUIDv7: An incrementing UUID by time
 *
 * This UUID generation algorithm combines UUIDv1 with UUIDv4 to guarantee its
 * order by timestamp using standard sorting.
 *
 * Application: This UUID may be used as a replacement for database ids where
 * its nature guarantees a strict sorting order.
 *
 *               version id
 *               |
 * 00000000-0000-7000-0000-000000000000
 * |-----------|  |-------------------|
 *  time in ms     random
 *
 * The UUID is composed of a 48 bit timestamp in ms in gregorian epoch time,
 * where the timestamp starts by high-to-low bits (contrary to UUIDv1) and a
 * 76bit random part like with UUIDv4.
 *
 * For generation of the 48bit timestamp the ticks in gregorian epoch are
 * converted to a hexadecimal representation and zero-padded at the left.
 *
 * The 76bit random part is generated from cryptographically strong random byte
 * values.
 *
 * This design was chosen in order to guarantee an order on generated UUIDs by
 * the millisecond tick of the underlying OS. While UUIDv1 starts with
 * low-to-high bits such ordering functionality is not given there.
 *
 * The date-time range of UUIDv7 is valid from [1582-10-15 ... 10000-01-01[
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4122
 *
 * @param {number} [ticks=Date.now()]
 * @returns {string}
 */
export const uuid7 = (ticks = Date.now()) => {
  const gEpoch = ticks + GREGORIAN_EPOCH_TICKS
  if (gEpoch < 0) throw new Error('min date 1582-10-15')
  if (gEpoch > MAX_TICKS_MS) throw new Error('max date 9999-12-31')
  const ticksHex = gEpoch.toString(16).padStart(12, '0').split('')
  const rand = crypto.getRandomValues(new Uint8Array(32))
  let i = -1
  return TMPL.replace(/0/g, () =>
    ++i < 12 ? ticksHex[i] : (rand[i] & 0xf).toString(16)
  )
}

/**
 * get the date from a UUIDv7
 * @param {string} uuidv7
 * @returns {Date} the date-time of the UUID
 */
export const uuid7ms = (uuid) => {
  if (uuid[14] !== '7') throw new Error('not a UUIDv7')
  const ts = uuid.slice(0, 13).replace('-', '')
  const ticks = parseInt(ts, 16) - GREGORIAN_EPOCH_TICKS
  return new Date(ticks)
}
