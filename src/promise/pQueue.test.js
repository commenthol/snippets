import { deepEqual } from 'assert'
import { pQueue } from './pQueue.js'

const nap = (ms = 10) =>
  new Promise((resolve) => setTimeout(() => resolve(ms), ms))

const promised = () => {
  const p = {}
  p.promise = new Promise((resolve) => {
    p.resolve = resolve
  })
  return p
}

const fulfilled = (result) =>
  result.map(({ status, value, reason }) => {
    if (status === 'rejected') {
      return { status, reason: reason?.message }
    }
    return { status, value }
  })

describe('promise/pQueue', () => {
  it('shall resolve if empty', async function () {
    const queue = pQueue()
    const result = await queue.onEmpty()
    deepEqual(result, [])
  })

  it('shall process queued items', async function () {
    const queue = pQueue()
    queue.add(() => Promise.resolve('resolve'))
    queue.add(() => nap(20))
    queue.add(() => Promise.reject(new Error('reject')))
    queue.add(() => nap(0))

    const result = await queue.onEmpty()
    deepEqual(fulfilled(result), [
      { status: 'fulfilled', value: 'resolve' },
      { status: 'fulfilled', value: 20 },
      { status: 'rejected', reason: 'reject' },
      { status: 'fulfilled', value: 0 },
    ])
  })

  it('should wait till timeout for adding task', async function () {
    const p = promised()
    const queue = pQueue({ timeout: 10 })
    queue.onEmpty().then((result) => {
      p.resolve(result)
    })
    await nap(9)
    queue.add(() => nap(6))
    queue.add(() => nap(8))
    await nap(9)
    queue.add(() => nap(10))
    const result = await p.promise
    deepEqual(result, [
      { status: 'fulfilled', value: 6 },
      { status: 'fulfilled', value: 8 },
      { status: 'fulfilled', value: 10 },
    ])
  })
})
