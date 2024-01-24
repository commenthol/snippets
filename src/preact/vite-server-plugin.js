const bodyParserJson = (req, res, next) => {
  let data = ''
  req.on('data', (chunk) => { data += chunk.toString() })
  req.on('end', () => {
    try {
      req.body = JSON.parse(data)
      next()
    } catch (err) {
      next()
    }
  })
}

const send = (res, body, status = 200) => {
  if (typeof body === 'object') {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    body = JSON.stringify(body)
  }
  res.statusCode = status
  res.end(body)
}

const useFetchTests = (req, res, next) => {
  const { method, url } = req
  const parsed = new URL(url, 'null://')
  // console.log(method, url)
  switch (parsed.pathname) {
    case '/use-fetch/test': {
      if (method === 'POST') {
        const { method, url, headers, body } = req
        setTimeout(() => {
          send(res, { method, url, body, headers })
        }, 200)
      } else {
        send(res, { test: 1 })
      }
      return
    }
    case '/use-fetch/delayed': {
      const delay = 2000
      setTimeout(() => {
        send(res, { delay })
      }, delay)
      return
    }
    case '/use-fetch/timeout': {
      // There is no answer!!!
      return
    }
    case '/use-fetch/not-json': {
      res.end('This is not a json.')
      return
    }
    case '/use-fetch/not-found': {
      send(res, '', 404)
      return
    }
    case '/use-fetch/error': {
      const status = parsed.searchParams.get('status')
      send(res, { error: `status ${status}` }, status || 500)
      return
    }
    case '/use-fetch/error-500': {
      send(res, { error: 'Internal server error' }, 500)
      return
    }
  }
  next()
}

const serverPlugin = () => ({
  name: 'configure-server',
  configureServer (server) {
    server.middlewares.use(bodyParserJson)
    // server.middlewares.use((req, res, next) => {
    //   console.log(req.url, req.method)
    //   next()
    // })
    server.middlewares.use(useFetchTests)
  }
})

export default serverPlugin
