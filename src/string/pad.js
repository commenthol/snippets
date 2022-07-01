/**
 * Pads `string` on the right and left side if it's shorter than `length`.
 * String is truncated if it exceeds length.
 * @example
 * pad('cat'); //> '  cat   '
 * pad(42, 4, '0'); //> '0420'
 * pad('foobar', 3); //> 'oba'
 */
export const pad = (string, length = 8, char = ' ') => {
  const fill = Array(length).fill(char).join('')
  const padded = fill + string + fill
  const start = Math.ceil((padded.length - length) / 2)
  return padded.substring(start, start + length)
}
