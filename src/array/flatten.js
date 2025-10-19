/**
 * recursively deep flattens an array
 * @example
 * flatten([1, [2], [[3], 4], 5]) //> [1, 2, 3, 4, 5]
 */
// export const flatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? flatten(v) : v)))

// using ES2019 .flat()
export const flatten = (arr) => arr.flat(Infinity)
