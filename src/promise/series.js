/**
 * Run Promises in series one after the other
 * @example
 * series(
 *   x => Promise.resolve(x + 1),
 *   x => Promise.resolve(x + 2)
 * )(3).then((x) => console.log(x))
 * //> 6
 */
export const series = (...fns) => arg =>
  fns.reduce((p, f) => p.then(f), Promise.resolve(arg))
