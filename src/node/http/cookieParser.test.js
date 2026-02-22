import request from 'supertest'
import { connect, cookieParser, queryParser } from './index.js'

describe('node/http/cookieParser', function () {
  let app
  let agent

  before(function () {
    // poor router
    const route = (req, method, pattern) => {
      return req.method === method && req.url.indexOf(pattern) !== -1
    }

    app = connect(
      queryParser,
      cookieParser,
      (req, res, next) => {
        if (!route(req, 'GET', '/set')) return next()
        for (const [k, v] of Object.entries(req.query)) {
          res.cookie(k, v)
        }
        res.end()
      },
      (req, res, next) => {
        if (!route(req, 'GET', '/clear')) return next()
        for (const k in req.query) {
          res.clearCookie(k)
        }
        res.end()
      },
      (req, res) => {
        res.end(JSON.stringify(req.cookies))
      }
    )

    agent = request.agent(app)
  })

  it('should set response cookies', async function () {
    await agent
      .get('/set?test=42&foo=bar')
      .expect(200)
      .then((_res) => {
        // console.log(_res.headers)
      })
    await agent.get('/').expect(200, '{"test":"42","foo":"bar"}')
  })

  it('should clear response cookies', async function () {
    await agent
      .get('/clear?foo=bar')
      .expect(200)
      .then((_res) => {
        // console.log(res.headers)
      })
    await agent.get('/').expect(200, '{"test":"42"}')
  })
})
