import assert from 'assert'
import { Interval } from './index.js'

describe('date/Interval', () => {
  it('should run', function (done) {
    let n = 0
    const start = Date.now()
    const fn = () => {
      if (++n >= 4) {
        interval.clear()
        assert.ok(Date.now() - start >= 40)
        done()
      }
    }
    const interval = new Interval(fn, 10).start().unref()
  })
})
