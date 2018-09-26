/**
 * Convert callback function to Promise
 * node>=8 contains `[util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)`
 * @example
 * const timeout = (ms, cb) => setTimeout(() => { cb() }, ms)
 * promisify(timeout)(1000).then(() => console.log('done'))
 */
export const promisify = fn => (...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, result) => (err ? reject(err) : resolve(result)))
  )
