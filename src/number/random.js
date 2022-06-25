/**
 * create a random number
 * @param {number} lower
 * @param {number} upper
 * @returns {number}
 */
export function random (lower = 1, upper = 0) {
  const _lower = Math.min(lower, upper)
  const _upper = Math.max(lower, upper)
  return _lower + (_upper - _lower) * Math.random()
}

/**
 * create a random number integer
 * @param {number} lower
 * @param {number} upper
 * @returns {number}
 */
export function randomInt (lower = 1, upper = 0) {
  const _lower = Math.min(lower, upper)
  const _upper = Math.max(lower, upper)
  return Math.floor(_lower + (1 + _upper - _lower) * Math.random())
}
