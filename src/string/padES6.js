/**
 * ES6 Same as `pad` with just using String.padStart().padEnd()
 * - Only works with real strings
 * - Does not truncate to `length` if smaller that `string.length`
 * @example
 * 'cat'.pad(8, '#') //> '##cat###'
 * 'foobar'.pad(3) //> 'foobar'
 */
export const padES6 = (string, length = 8, char = ' ') =>
  string.padStart((string.length + length) / 2, char).padEnd(length, char)
