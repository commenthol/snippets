import assert from 'assert'
import { EventEmitter } from '../..'// "/src/node"

describe('node/EventEmitter', () => {
  let ee
  beforeEach(() => {
    ee = new EventEmitter()
  })
  it('on is same as addListener ', () => {
    assert.ok(ee.on === ee.addListener)
  })
  it('off is same as removeListener ', () => {
    assert.ok(ee.off === ee.removeListener)
  })
  it('should emit event', (done) => {
    ee.on('listen', () => {
      done()
    })
    ee.emit('listen')
  })
  it('should emit with arguments', (done) => {
    const payload = { data: 1 }
    ee.on('listen', (_payload, _payload1) => {
      assert.deepStrictEqual(_payload, payload)
      assert.deepStrictEqual(_payload1, payload)
      done()
    })
    ee.emit('listen', payload, payload)
  })
  it('should ignore unregistered event', () => {
    ee.emit('unknown')
  })
  it('should emit event only once', (done) => {
    let count = 0
    ee.once('listen', () => {
      count++
    })
    ee.emit('listen')
    ee.emit('listen')
    setTimeout(() => {
      assert.ok(count === 1)
      done()
    })
  })
  it('should ignore unregistered event', () => {
    ee.emit('unknown')
  })
  it('should add a large number of events', (done) => {
    let count = 0

    for (let i = 0; i <= 10000; i++) {
      ee.on('listen', () => {
        count += i
      })
    }
    ee.on('listen', () => {
      assert.ok(count === 50005000)
      done()
    })
    ee.emit('listen')
  })
  it('should remove all listeners', (done) => {
    let count = 0

    for (let i = 0; i <= 10; i++) {
      ee.on('listen', () => {
        count += i
      })
    }
    ee.emit('listen')
    ee.removeAllListeners()
    count = 0
    ee.emit('listen')
    setTimeout(() => {
      assert.ok(count === 0)
      done()
    })
  })
  it('should remove all listener of eventName', (done) => {
    let count = 0

    for (let i = 0; i <= 10; i++) {
      ee.on('listen', () => {
        count += i
      })
      ee.on('plus1', () => {
        count += (i + 1)
      })
    }
    ee.emit('listen')
    ee.emit('plus1')
    assert.ok(count === 121, count)
    ee.removeAllListeners('plus1')
    count = 0
    ee.emit('listen')
    setTimeout(() => {
      assert.ok(count === 55, count)
      done()
    })
  })
  it('should get listener count', () => {
    for (let i = 0; i < 10; i++) {
      ee.on('listen', () => {})
    }
    assert.ok(ee.listenerCount('listen') === 10)
    assert.ok(ee.listenerCount() === 0)
  })
})
