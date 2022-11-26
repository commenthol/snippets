const CONTENT_TYPE = 'content-type'
const MIME_JSON = 'application/json'
const CHARSET = '; charset=utf-8'

const nap = (delay = 0) => new Promise((resolve) => setTimeout(() => {
  resolve(delay)
}, delay))

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * @param {string} url
 * @param {object} options fetch options
 * @param {number} [options.timeout] abort on timeout
 * @param {number} [options.retry=0]
 * @param {number} [options.retryDelay=1000] delay in ms
 * @returns {Promise<Response>}
 */
export async function fetchTimeout (url, options) {
  let res
  let err

  const { timeout, retry = 0, retryDelay = 1e3, ...opts } = options || {}

  if (typeof opts.body === 'object') {
    opts.body = JSON.stringify(opts.body)
    if (opts.method[0] === 'P' && !opts.headers?.[CONTENT_TYPE]) {
      opts.headers = {
        accept: MIME_JSON,
        [CONTENT_TYPE]: MIME_JSON + CHARSET,
        ...opts.headers
      }
    }
  }
  if (timeout && !opts.signal) {
    const controller = new AbortController()
    opts.signal = controller.signal
    setTimeout(() => controller.abort(), timeout)
  }

  try {
    res = await fetch(url, opts)
    if (res.status < 400) {
      return res
    }
  } catch (e) {
    err = e
    if (e.name === 'AbortError') {
      err = new Error(`Request timed out after ${timeout}ms`)
      err.name = 'AbortError'
    }
  }

  if (res?.status >= 500 && retry > 0) {
    await nap(retryDelay)
    return await fetchTimeout(url, { ...opts, timeout, retry: retry - 1, retryDelay })
  }

  console.log(err)
  err = err || new Error(res?.statusText || 'fetch failed')
  err.response = res
  err.status = res?.status

  throw err
}
