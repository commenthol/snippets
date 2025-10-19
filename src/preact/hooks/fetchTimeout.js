const CONTENT_TYPE = 'content-type'
const MIME_JSON = 'application/json'
const CHARSET = '; charset=utf-8'

const nap = (ms = 0) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(ms)
    }, ms)
  )

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * @param {string} url
 * @param {object} options fetch options
 * @param {number} [options.timeout] abort on timeout
 * @param {number} [options.retry=0]
 * @param {number} [options.retryDelay=10e3] delay in ms
 * @returns {Promise<Response>}
 */
export async function fetchTimeout(url, options) {
  const { timeout, retry = 0, retryDelay = 10e3, ...opts } = options || {}

  if (typeof opts.body === 'object') {
    opts.body = JSON.stringify(opts.body)
    if (opts.method[0] === 'P' && !opts.headers?.[CONTENT_TYPE]) {
      opts.headers = {
        accept: MIME_JSON,
        [CONTENT_TYPE]: MIME_JSON + CHARSET,
        ...opts.headers,
      }
    }
  }
  if (timeout && !opts.signal) {
    const controller = new AbortController()
    opts.signal = controller.signal
    setTimeout(() => controller.abort(), timeout)
  }

  const res = await fetch(url, opts)
  if (res.ok) {
    return res
  }

  if (res?.status >= 500 && retry > 0) {
    await nap(retryDelay)
    return await fetchTimeout(url, {
      ...opts,
      timeout,
      retry: retry - 1,
      retryDelay,
    })
  }

  const text = await res.text()
  throw new ResponseError(res, text)
}

export class ResponseError extends Error {
  /**
   * @param {Response} [response]
   * @param {string} [text]
   */
  constructor(response, text) {
    super(response?.statusText || 'fetch failed')
    this.response = response
    this.status = response?.status || 500
    this.text = text
    try {
      this.body = text && JSON.parse(text)
    } catch (_err) {}
  }
}
