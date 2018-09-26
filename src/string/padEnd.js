/**
 * Pads `string` on the right side if it's shorter than `length`.
 * String is truncated if it exceeds length.
 * ES6 has a native `String.prototype.padEnd()` method which does no truncation
 *
 * @example
 * padEnd('cat'); //> 'cat     '
 * padEnd(42, 4, '0'); //> '4200'
 * padEnd('foobar', 3); //> 'foo'
*/
export const padEnd = (string, length = 8, char = ' ') =>
  (string + Array(length).fill(char).join('')).substr(0, length)
