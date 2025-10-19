/**
 * Uniques members of an array
 * @example
 * uniq([1, 3, 2, 4, 4, 2, 0]) //> [ 1, 3, 2, 4, 0 ]
 */
export const uniq = (arr) => Array.from(new Set(arr))
