import assert from 'assert'
import { describe as describeX, it } from './mocha.js'

const sleep = (ms = 10) => new Promise((resolve) => setTimeout(() => resolve(), ms))

describeX.skip('simple mocha', function () {
  it('ok synch', function () {
    assert.ok(true)
  })

  describeX('good cases', function () {
    it('ok callback', function (done) {
      assert.ok(true)
      done()
    })

    it('ok promise', async function () {
      await sleep(1)
      assert.ok(true)
    })
  })

  describeX('bad cases', function () {
    it('fail synch', function () {
      assert.ok(false)
    })

    it('fail callback', function (done) {
      assert.ok(false)
      done()
    })

    it('fail promise', async function () {
      await sleep(1)
      assert.ok(false)
    })
  })
})
