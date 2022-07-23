
const hasAbortController = typeof AbortController !== 'undefined'

export const sleep = (delay) => new Promise(resolve => {
  if (!delay || delay <= 0) resolve()
  setTimeout(() => { resolve() }, delay)
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * @param {string} url
 * @param {object} options fetch options
 * @param {number} [options.retry=2]
 * @param {number} [options.retryDelay=1000] delay in ms
 * @returns {Promise<any>}
 */
export async function fetchRetry (url, options) {
  const { retry = 2, retryDelay = 1000, ..._options } = options
  const res = await fetch(url, _options)
  _options.retry = retry - 1
  return (res.status < 500 || retry <= 0)
    ? res
    : sleep(retryDelay).then(() => fetchRetry(url, _options))
}

/**
 * fetch with timeout and retry
 * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * @param {string} url
 * @param {object} options fetch options
 * @param {number} [options.timeout]
 * @param {number} [options.retry=2]
 * @param {number} [options.retryDelay=1000] delay in ms
 * @returns {Promise<any>}
 */
export function fetchTimeout (url, options) {
  const { timeout, ..._options } = options
  if (timeout && !options.signal && hasAbortController) {
    const controller = new AbortController()
    _options.signal = controller.signal
    setTimeout(() => controller.abort(), timeout)
  }
  return fetchRetry(url, _options).catch(err => {
    if (err.name === 'AbortError') {
      err = new Error(`Request timed out after ${timeout}ms`)
      err.name = 'AbortError'
    }
    return Promise.reject(err)
  })
}

const MIME_JSON = 'application/json; charset=utf-8'

/**
 * set JSON headers and stringify body if body is an object and method is POST, PUT or PATCH
 * @param {object|string} options.body
 * @returns {object} fetch options
 */
export function jsonify (options) {
  const _options = { ...options }
  if (typeof _options.body === 'object') {
    _options.body = JSON.stringify(_options.body)

    // set Content-Type for methods POST, PUT, PATCH
    if (_options?.method[0] === 'P') {
      _options.headers = {
        Accept: MIME_JSON,
        'Content-Type': MIME_JSON,
        ..._options.headers
      }
    }
  }
  return _options
}
