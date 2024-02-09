import assert from 'assert'
import { isAsyncFunction } from './index.js'

describe('function/isAsyncFn', () => {
  it('async fn', async () => {
    async function fn () { }
    assert.ok(isAsyncFunction(fn))
  })
  it('anonymous sync fn', () => {
    function fn () { }
    assert.ok(!isAsyncFunction(fn))
  })
  it('anonymous async fn', () => {
    const fn = async () => { }
    assert.ok(isAsyncFunction(fn))
  })
  it('anonymous sync fn', () => {
    const fn = () => {}
    assert.ok(!isAsyncFunction(fn))
  })
  it.skip('transpiled async fn', () => { // NOTE: Can't realiably detect transpiled async functions
    assert.ok(isAsyncFunction(transpiled))
  })
})

// babel 6.26.0 transpiled function

const transpiled = _asyncToGenerator(function * () {
  return 5
})

// eslint-disable-next-line no-var
function _asyncToGenerator (fn) { return function () { const gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step (key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { return Promise.resolve(value).then(function (value) { step('next', value) }, function (err) { step('throw', err) }) } } return step('next') }) } }
