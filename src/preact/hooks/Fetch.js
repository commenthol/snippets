import { fetchTimeout } from './fetchTimeout.js'

const CONTENT_TYPE = 'content-type'
const MIME_JSON = 'application/json'
const CHARSET_UTF8 = '; charset=utf-8'

export class Fetch {
  constructor(opts) {
    const {
      url = '',
      timeout = 5000,
      retry = 2,
      retryDelay = 1000,
      headers = {},
      ..._opts
    } = opts || {}
    this._opts = { timeout, retry, retryDelay, ..._opts }
    this._baseUrl = url
    this._headers = headers
  }

  static async toJsonOrText(res) {
    try {
      if (res.headers.get(CONTENT_TYPE)?.startsWith(MIME_JSON)) {
        return await res.json()
      }
      return await res.text()
    } catch (_err) {}
  }

  setHeader(name, value) {
    if (value === null || value === undefined) {
      Reflect.deleteProperty(this._headers, name)
    } else {
      this._headers[name] = value
    }
  }

  async _fetch(url, options) {
    const _url = this._baseUrl + url
    const res = await fetchTimeout(_url, {
      headers: this._headers,
      ...this._opts,
      ...options,
    })
    return await Fetch.toJsonOrText(res)
  }

  _fetchQ(url, { query, headers, method = 'GET' } = {}) {
    const searchParams = new URLSearchParams()
    for (const [k, v] of Object.entries(query || {})) {
      for (const vv of [].concat(v)) {
        searchParams.append(k, vv)
      }
    }
    const search = searchParams.toString()
    const _headers = { ...headers, ...this._headers }
    const _url = url + (search ? `?${search}` : '')
    return this._fetch(_url, { method, headers: _headers })
  }

  _fetchP(url, { body, headers, method = 'POST' } = {}) {
    let _body = body
    const _headers = { ...headers, ...this._headers }
    if (typeof body !== 'string') {
      _body = JSON.stringify(body)
      _headers[CONTENT_TYPE] = MIME_JSON + CHARSET_UTF8
    }
    return this._fetch(url, { method, headers: _headers, body: _body })
  }
}
