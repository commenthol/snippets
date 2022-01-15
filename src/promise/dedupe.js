/**
 * de-duplicate an asynchronous function `asyncFn`
 * @param {Function} asyncFn
 * @returns {() => Promise<any>}
 */
export function dedupe (asyncFn) {
  let promises = []

  return () => {
    const p = {}

    const promise = new Promise((resolve, reject) => {
      p.resolve = resolve
      p.reject = reject
    })
    promises.push(p)

    if (promises.length === 1) {
      asyncFn()
        .then(result => promises.forEach(p => p.resolve(result)))
        .catch(err => promises.forEach(p => p.reject(err)))
        .finally(() => { promises = [] })
    }

    return promise
  }
}
