import assert from 'assert'
import { parallelLimit } from './index.js'

const timeout = (ms = 10) => new Promise(resolve => setTimeout(() => resolve(), ms))

const diff = (start) => Math.floor((Date.now() - start) / 10) * 10

describe('promise/parallelLimit', () => {
  it('shall limit parallel execution', async () => {
    const start = Date.now()
    const res = await parallelLimit(
      2,
      () => timeout(40).then(() => diff(start)),
      () => timeout(10).then(() => diff(start)),
      () => timeout(20).then(() => diff(start)),
      () => timeout(10).then(() => Promise.reject(new Error(diff(start)))),
      () => Promise.resolve(diff(start))
    )
    // console.log(res)
    assert.deepStrictEqual(
      res.map(item => item.status),
      ['fulfilled', 'fulfilled', 'fulfilled', 'rejected', 'fulfilled']
    )
    assert.deepStrictEqual(
      res.map(({ value, reason }) => (value || reason.message)),
      [40, 10, 30, '40', 40]
    )
  })

  it('shall terminate ', async () => {
    const start = Date.now()
    const res = await parallelLimit(
      2,
      () => timeout(40).then(() => diff(start)),
      undefined,
      () => timeout(10).then(() => diff(start))
    )
    // console.log(res)
    assert.deepStrictEqual(
      res.map(item => item.status),
      ['fulfilled', 'rejected', 'fulfilled']
    )
    assert.deepStrictEqual(
      res.map(({ value, reason }) => (value || reason.message)),
      [40, 'no function', 10]
    )
  })

  it('shall resolve if empty', async () => {
    const res = await parallelLimit(2)
    assert.deepStrictEqual(res, [])
  })

  it('shall resolve if limit is negative', async () => {
    const res = await parallelLimit(-2)
    assert.deepStrictEqual(res, [])
  })
})
