/**
 * create a random number
 * @param {number} lower
 * @param {number} upper
 * @param {boolean} useFloat
 * @returns {number}
 */
export function random (lower = 0, upper = 1, useFloat) {
  if (useFloat === undefined) {
    if (lower === true) {
      useFloat = true
      upper = 1
      lower = 0
    } else if (upper === true) {
      useFloat = true
      upper = lower
      lower = 0
    }
    useFloat = useFloat || !!(upper % 1 || lower % 1)
  }
  const rand = lower + (upper - lower) * Math.random()
  return useFloat ? rand : Math.floor(rand + 0.5)
}
