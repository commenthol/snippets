import request from './request.js'

const userAgent =
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0'

const headers = { 'User-Agent': userAgent }

/**
 * check availability of a single link
 * @param {string} url
 * @param {Object} [opts={ timeout: 5000 }]
 * @return {Promise<{status: string, statusCode: number}>}
 */
export function checkLink(url, opts = { timeout: 5000 }) {
  opts.headers = opts.headers || headers
  return request(url)
    .set(opts.headers)
    .timeout(opts.timeout)
    .head()
    .end()
    .catch(() =>
      request(url)
        .set(opts.headers)
        .timeout(opts.timeout)
        .end()
        .catch(() => {
          return { statusCode: 500 }
        })
    )
    .then(({ status, statusCode }) => {
      status = status || 'dead'
      switch (statusCode) {
        case 200:
        case 401:
        case 403:
          status = 'alive'
          break
      }
      return { status, statusCode }
    })
}

/**
 * check various links on their availability
 * @param {string[]} urls
 * @param {Object} [opts={}]
 * @param {number} [opts.parallel=5] parallel requests
 * @param {number} [opts.timeout=5000] timeout
 * @return {Promise}
 */
export async function checkLinks(urls, opts = {}) {
  const bulk = opts.parallel || 5

  return new Promise((resolve) => {
    let lock = false
    let processed
    let running = (processed = urls.length)
    const result = new Array(urls.length)

    const run = async () => {
      const pos = --running
      const url = urls[running]
      if (running >= 0) {
        const stat = await checkLink(url, opts)
        result[pos] = { url, ...stat }
        if (!lock) run()
        if (--processed === 0) resolve(result)
      } else {
        lock = true
      }
    }

    for (let j = 0; j < bulk; j++) run()
  })
}
