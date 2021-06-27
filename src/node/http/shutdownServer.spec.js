import assert from 'assert'
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fetch } from './fetch.js'
import { shutdownServer } from './shutdownServer.js'
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '')

const key = fs.readFileSync(path.resolve(__dirname, '../../../certs/site.key'))
const cert = fs.readFileSync(path.resolve(__dirname, '../../../certs/site.crt'))
const ca = fs.readFileSync(path.resolve(__dirname, '../../../certs/root_ca.crt'))

const timeout = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

describe('shutdownServer', function () {
  describe('http', function () {
    let server
    let start
    const port = 30000
    let connectCnt = 0

    const diffTime = () => String(Date.now() - start)

    before(function (done) {
      server = http.createServer((req, res) => {
        connectCnt++
        setTimeout(() => {
          res.end(diffTime())
        }, 50)
      })
      start = Date.now()
      server._log = (...args) => console.log(diffTime(), ...args)
      shutdownServer(server, { gracefulTimeout: 50 })
      server.listen(port, done)
    })

    it('shall gracefully shutdown', async function () {
      const out = []
      const max = 50
      let hasClosed = false

      let _resolve
      const p = new Promise((resolve) => {
        _resolve = resolve
      })

      const pushIt = value => {
        if (value instanceof Error) {
          out.push({ i: out.length, value: diffTime(), message: value.message })
        } else {
          out.push({ i: out.length, value })
        }
        if (out.length === max) {
          _resolve()
        }
      }

      for (let i = 0; i < max; i++) {
        fetch('http://localhost:' + port, { method: http.METHODS[i % http.METHODS.length] })
          .then(res => res.text())
          .then(pushIt)
          .catch(pushIt)
        await timeout(3)
        // console.log(i, diffTime())
        if (i === 25) {
          server.close((err) => {
            // console.log(diffTime())
            hasClosed = true
            assert.ok(!err)
          })
        }
      }

      await p

      // console.log(out)
      assert.ok(hasClosed)
      assert.ok(connectCnt >= 25, connectCnt)
    })
  })

  describe('https', function () {
    let server
    let start
    const port = 30001
    let connectCnt = 0

    const diffTime = () => String(Date.now() - start)

    before(function (done) {
      server = https.createServer({ key, cert, ca }, (req, res) => {
        connectCnt++
        setTimeout(() => {
          res.end(diffTime())
        }, 50)
      })
      start = Date.now()
      server._log = (...args) => console.log(diffTime(), ...args)
      shutdownServer(server, { gracefulTimeout: 50 })
      server.listen(port, done)
    })

    it('shall gracefully shutdown', async function () {
      const out = []
      const max = 50
      let hasClosed = false

      let _resolve
      const p = new Promise((resolve) => {
        _resolve = resolve
      })

      const pushIt = value => {
        if (value instanceof Error) {
          out.push({ i: out.length, value: diffTime(), message: value.message })
        } else {
          out.push({ i: out.length, value })
        }
        if (out.length === max) {
          _resolve()
        }
      }

      for (let i = 0; i < max; i++) {
        fetch('https://localhost:' + port, { ca, rejectUnauthorized: false, method: http.METHODS[i % http.METHODS.length] })
          .then(res => res.text())
          .then(pushIt)
          .catch(pushIt)
        await timeout(3)
        // console.log(i, diffTime())
        if (i === 25) {
          server.close((err) => {
            // console.log(diffTime())
            hasClosed = true
            assert.ok(!err)
          })
        }
      }

      await p

      // console.log(out)
      assert.ok(hasClosed)
      assert.ok(connectCnt >= 25, connectCnt)
    })
  })
})
