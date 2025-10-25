import assert from 'node:assert'
import http from 'http'
import { checkLinks } from './checkLinks.js'

describe('node/http/checkLinks', function () {
  let server

  const port = 30003
  const host = `http://localhost:${port}`

  before((done) => {
    server = http.createServer((req, res) => {
      const { url } = req
      if (url === '/destroy') {
        res.destroy()
      } else if (url === '/dead') {
        res.statusCode = 500
        res.end()
      } else if (url === '/404') {
        res.statusCode = 404
        res.end()
      } else {
        res.end()
      }
    })
    server.listen(port, done)
  })

  after(() => {
    server.close()
  })

  it('shall request links', async function () {
    const res = await checkLinks(
      [
        host + '/',
        host + '/destroy',
        host + '/dead',
        'https://this.is.not.a.domain/test',
        host + '/404',
        host + '/200',
      ],
      { parallel: 3 }
    )

    assert.deepStrictEqual(res, [
      {
        url: host + '/',
        status: 'alive',
        statusCode: 200,
      },
      {
        url: host + '/destroy',
        status: 'dead',
        statusCode: 500,
      },
      {
        url: host + '/dead',
        status: 'dead',
        statusCode: 500,
      },
      {
        url: 'https://this.is.not.a.domain/test',
        status: 'dead',
        statusCode: 500,
      },
      {
        url: host + '/404',
        status: 'dead',
        statusCode: 404,
      },
      {
        url: host + '/200',
        status: 'alive',
        statusCode: 200,
      },
    ])
  })
})
