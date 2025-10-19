/**
 * @returns {{
 *  promise: Promise
 *  resolve: (any) => {}
 * }}
 */
const promised = () => {
  const p = {}
  p.promise = new Promise((resolve) => {
    p.resolve = resolve
  })
  return p
}

/**
 * @typedef {() => Promise<any>} AsyncFunction
 */
/**
 * @typedef {object} PQueueOptions
 * @property {number} [limit=10]
 * @property {number} [timeout=20] timeout in ms
 */
/**
 * @typedef {object} PQueue
 * @property {AsyncFunction[]} add
 * @property {() => number} size
 * @property {Promise<PromiseSettledResult[]>} onEmpty
 */

/**
 * an async queue with concurrency and timeout
 * @param {PQueueOptions} param
 * @returns {PQueue}
 * @example
 * // concurrency = 3; timeout until resolving = 50ms
 * const queue = pQueue({ limit: 3, timeout: 50 })
 * queue.add(async() => 5)
 * const result = await queue.onEmpty()
 * //> [{status: 'fulfilled', value: 5}]
 */
export const pQueue = (param) => {
  const { limit = 10, timeout = 20 } = param || {}
  const result = []
  const p = promised()
  const fns = []
  let i = 0
  let running = 0
  let isResolved = false
  let timerId

  function retrigger() {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!isResolved && running <= 0) {
        isResolved = true
        p.resolve(result)
      }
    }, timeout)
  }

  function runner() {
    const c = i
    const fn = fns.shift()
    const done = fn === undefined
    const promise =
      typeof fn === 'function'
        ? fn()
        : !done && Promise.reject(new TypeError('no function'))

    if (done) {
      running--
    } else {
      i++
    }
    if (!isResolved && running <= 0) {
      retrigger()
    } else if (promise) {
      promise
        .then((value) => {
          result[c] = { status: 'fulfilled', value }
        })
        .catch((err) => {
          result[c] = { status: 'rejected', reason: err }
        })
        .finally(() => {
          runner()
        })
    }
  }

  /**
   * Add task(s) to queue
   * @param  {AsyncFunction[]} tasks
   */
  function add(...tasks) {
    if (isResolved) {
      throw new Error('pQueue has been resolved')
    }
    if (!tasks.length) return
    tasks.forEach((fn) => fns.push(fn))
    const l = Math.min(fns.length, limit)
    while (running < l) {
      running++
      setImmediate(() => {
        runner()
      })
    }
  }

  function onEmpty() {
    if (!isResolved && running <= 0) {
      retrigger()
    }
    return p.promise
  }

  /**
   * @returns {number} size of queue
   */
  function size() {
    return fns.length
  }

  return {
    add,
    size,
    onEmpty,
  }
}
