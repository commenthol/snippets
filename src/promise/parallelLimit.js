/**
 * Limit parallel execution of Promises
 * @example
 * await parallelLimit(
 *   2, // limit to 2 concurrent tasks
 *   [ () => Promise.resolve(1),
 *     () => Promise.reject(new Error(2))
 *     () => Promise.resolve(3)
 *   ]
 * )
 * //> [{ status: 'fulfilled', value: 1 },
 *      { status: 'rejected', reason: {Error: 2} },
 *      { status: 'fulfilled', value: 3 }]
 */
export const parallelLimit = (limit, ...fns) =>
  new Promise((resolve) => {
    const result = new Array(fns.length).fill(undefined)
    let i = 0
    let ended = 0

    function runner () {
      const p = i
      const fn = fns[i]
      const promise = (typeof fn === 'function')
        ? fn()
        : (p < fns.length) && Promise.reject(new TypeError('no function'))
      i += 1

      if (ended >= fns.length) {
        resolve(result)
      } else if (promise) {
        promise
          .then(value => { result[p] = { status: 'fulfilled', value } })
          .catch(err => { result[p] = { status: 'rejected', reason: err } })
          .finally(() => { ended += 1; runner() })
      }
    }

    const l = Math.min(limit, fns.length)
    if (l <= 0) resolve([])
    for (let j = 0; j < l; j++) {
      runner()
    }
  })
