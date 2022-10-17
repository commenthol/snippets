import net from 'net'
import LRUCache from 'mnemonist/lru-cache.js'

/**
 * assumption is that we are behind a proxy which adds a
 * @param {object} req Request
 * @return {string|undefined} ip address
 */
export const getXForwardedForIp = (req) => {
  const xForwardedFor = req.headers?.['x-forwarded-for'] || req.socket.remoteAddress || ''
  const ips = xForwardedFor.split(',')
  const clientIp = ips[0]
  // TODO check if last ip is trusted one?
  return net.isIP(clientIp) ? clientIp : undefined
}

/**
 * express rate-limiting middleware
 * headers are according to https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers
 * @param {object} opts
 * @param {boolean} [opts.headers] set x-ratelimit headers
 * @param {number} [opts.lruSize=10000] LRU cache size
 * @param {number} [opts.max=10]
 * @param {number} [opts.timeoutSec=1] timeout in seconds
 * @param {function} [opts.getKey] `(req: Request) => string` obtain key from request; default is ip from x-forwarded-for header
 * @param {async function} [opts.getCount] `(key: string) => number` obtain count with key from other cache if not in lru e.g. redis
 * @param {async function} [opts.setCount] `(key: string, value: number) => void` set key, value in foreign cache if not in lru e.g. redis
 * @returns {function} `(req: Request, res: Response, next: function) => undefined`
 */
export function rateLimit (opts = {}) {
  const {
    lruSize = 1e5,
    max = 10,
    timeoutSec = 1,
    getKey = getXForwardedForIp,
    getCount = async () => {},
    setCount = async () => {},
    clear = async () => {}
  } = opts

  const lru = new LRUCache(lruSize)
  let windowEnds

  function clearCache () { // TODO clear cache must run synchronously across all node instances
    windowEnds = (Math.floor(Date.now() / 1000) + timeoutSec) * 1000
    setTimeout(() => {
      clear()
      lru.clear()
      clearCache() // restart interval
    }, windowEnds - Date.now())
  }
  clearCache()

  function setHeaders (res, count) {
    if (res.headersSent) return
    res.setHeader('RateLimit-Limit', max)
    res.setHeader('RateLimit-Remaining', Math.max(max - count, 0))
    res.setHeader('RateLimit-Reset', Math.ceil(windowEnds / 1000))
  }

  function set429Headers (res) {
    res.setHeader('Retry-After', new Date(windowEnds).toUTCString())
  }

  return async function rateLimitM (req, res, next) {
    let err = null
    const key = getKey(req) || 'unknown'
    let _count = lru.get(key)
    if (!_count) {
      _count = await getCount(key)
    }
    const count = (_count || 0) + 1

    if (opts.headers) {
      setHeaders(res, count)
    }
    if (count > max) {
      err = new Error('err_rate_limit')
      res.statusCode = err.status = 429
      set429Headers(res)
    } else {
      lru.set(key, count)
      setCount(key, count)
    }

    next(err)
  }
}
