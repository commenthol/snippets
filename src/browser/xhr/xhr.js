// eslint-disable-next-line no-unused-vars
function xhr (url, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    withCredentials = true
  } = opts || {}

  const req = new XMLHttpRequest()
  req.open(method, url, true)
  req.withCredentials = withCredentials

  if (params) req.queryString = params
  for (const k in headers) {
    req.setRequestHeader(k, headers[k])
  }

  req.ontimeout = function (ev) {
    cb(new Error('xhr_timeout'))
  }
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      const err = (!req.status || req.status >= 300)
        ? new Error(req.status || 'xhr_error')
        : null
      cb(err, req.responseText)
    }
  }
  req.send(body)
}
