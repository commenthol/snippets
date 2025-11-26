const nap = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms).unref())

/**
 * backoff retry with exponential backoff strategy
 * @param {() => Promise<any>} asyncF
 * @param {object} [options]
 * @param {number} [options.initialDelay]=100
 * @param {number} [options.maxDelay=10e3]
 * @param {number} [options.maxRetry=Infinity]
 * @param {number} [options.factor=2]
 * @param {number} [options.jitter=0.5]
 * @param {console} [options.log]
 * @returns
 */
export async function backoff(asyncF, options) {
  const {
    initialDelay = 100,
    maxDelay = 10e3,
    maxRetry = Infinity,
    factor = 2,
    jitter = 0.5,
    log, // { debug: fn, error: fn }, e.g. console
  } = options || {}

  let attempt = 0

  function getDelay() {
    let delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay)

    if (jitter) {
      const rand = Math.random()
      const deviation = Math.floor(rand * jitter * delay)
      delay =
        (Math.floor(rand * 10) & 1) === 0
          ? delay - deviation
          : delay + deviation
    }

    attempt += 1
    return delay
  }

  for (;;) {
    try {
      return await asyncF()
    } catch (err) {
      log?.error(err)
      if (attempt >= maxRetry) {
        throw new Error(`exceeded max retries: ${maxRetry}`)
      }
      const delay = getDelay()
      log?.debug(`Backing off for ${delay}ms...`)
      await nap(delay)
    }
  }
}
