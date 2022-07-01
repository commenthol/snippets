/**
 * Pads `string` on the right side if it's shorter than `length`.
 * String is truncated if it exceeds length.
 * ES6 has a native `String.prototype.padStart()` method which does no truncation
 * @example
 * padStart('cat'); //> '     cat'
 * padStart(42, 4, '0'); //> '0042'
 * padStart('foobar', 3); //> 'bar'
 */
export const padStart = (string, length = 8, char = ' ') => {
  const padded = Array(length).fill(char).join('') + string
  const start = padded.length - length
  return padded.substring(start, start + length)
}
