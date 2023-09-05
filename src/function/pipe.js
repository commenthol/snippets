/**
 * pipe functions to avoid staircasing
 * @param  {Function[]} fns
 * @returns {(any) => any}
 * @example
 * const sub = a, b => a - b
 * const curry = (fn, b) => a => fn(a, b)
 * const r = 2
 * pipe(curry(sub, 1), curry(sub, 3))(r) // => 2 - 1 - 3 = -2
 * // instead of writing sub(sub(r, 1), 3)
 */
export const pipe = (...fns) => (arg) => {
  for (const fn of fns) {
    arg = fn(arg)
  }
  return arg
}
