import assert from 'node:assert'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
import { backoff } from './backoff.js'

describe('promise/backoff', () => {
  let mockLog

  beforeEach(() => {
    mockLog = {
      error: sinon.spy(),
      debug: sinon.spy(),
    }
  })

  it('should execute function successfully on first attempt', async () => {
    const asyncF = sinon.stub().resolves('success')
    const result = await backoff(asyncF, { log: mockLog })
    assert.strictEqual(result, 'success')
    assert.strictEqual(asyncF.callCount, 1)
    assert.strictEqual(mockLog.error.callCount, 0)
  })

  it('should retry and eventually succeed', async () => {
    const error = new Error('temporary failure')
    const asyncF = sinon
      .stub()
      .onFirstCall()
      .rejects(error)
      .onSecondCall()
      .rejects(error)
      .onThirdCall()
      .resolves('success')

    const result = await backoff(asyncF, { initialDelay: 10, log: mockLog })
    assert.strictEqual(result, 'success')
    assert.strictEqual(asyncF.callCount, 3)
    assert.strictEqual(mockLog.error.callCount, 2)
  })

  it('should throw when max retries exceeded', async () => {
    const error = new Error('permanent failure')
    const asyncF = sinon.stub().rejects(error)

    await assert.rejects(
      () => backoff(asyncF, { maxRetry: 2, initialDelay: 10, log: mockLog }),
      /exceeded max retries: 2/
    )

    assert.strictEqual(asyncF.callCount, 3) // initial + 2 retries
  })

  it('should apply exponential backoff', async () => {
    const error = new Error('failure')
    const asyncF = sinon.stub().rejects(error)

    await assert.rejects(() =>
      backoff(asyncF, {
        initialDelay: 10,
        maxDelay: 100,
        maxRetry: 3,
        factor: 2,
        jitter: 0,
        log: mockLog,
      })
    )

    assert(mockLog.debug.getCall(0).args[0].includes('10ms'))
    assert(mockLog.debug.getCall(1).args[0].includes('20ms'))
    assert(mockLog.debug.getCall(2).args[0].includes('40ms'))
  })

  it('should cap delay at maxDelay', async () => {
    const error = new Error('failure')
    const asyncF = sinon.stub().rejects(error)

    await assert.rejects(() =>
      backoff(asyncF, {
        initialDelay: 10,
        maxDelay: 50,
        maxRetry: 4,
        factor: 3,
        jitter: 0,
        log: mockLog,
      })
    )

    const debugCalls = mockLog.debug.getCalls()
    assert(debugCalls[0].args[0].includes('10ms'))
    assert(debugCalls[1].args[0].includes('30ms'))
    assert(debugCalls[2].args[0].includes('50ms'))
    assert(debugCalls[3].args[0].includes('50ms'))
  })

  it('should apply jitter to delay', async () => {
    const error = new Error('failure')
    const asyncF = sinon.stub().rejects(error)

    await assert.rejects(() =>
      backoff(asyncF, {
        initialDelay: 100,
        maxRetry: 2,
        factor: 1,
        jitter: 0.5,
        log: mockLog,
      })
    )

    const call1 = mockLog.debug.getCall(0).args[0]
    const call2 = mockLog.debug.getCall(1).args[0]
    const delay1 = parseInt(call1.match(/\d+/)[0])
    const delay2 = parseInt(call2.match(/\d+/)[0])

    assert(delay1 >= 50 && delay1 <= 150)
    assert(delay2 >= 50 && delay2 <= 150)
  })

  it('should use default options', async () => {
    const asyncF = sinon.stub().resolves('success')
    const result = await backoff(asyncF)
    assert.strictEqual(result, 'success')
  })
})
