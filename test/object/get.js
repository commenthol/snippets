import assert from 'assert'
import {get} from '../../src/object'

describe('object/get', () => {
  it('should get value from path', () => {
    const obj = {a: {b: {c: 1}}}
    assert.equal(get(obj, ['a', 'b', 'c']), 1)
  })
  it('should not get undefined value from path', () => {
    const obj = {a: {b: {c: 1}}}
    assert.equal(get(obj, ['d', 'e']), undefined)
  })
  it('should return object on missing path', () => {
    const obj = {a: {b: {c: 1}}}
    assert.equal(get(obj), obj)
  })
  it('should return default value', () => {
    const obj = {a: {b: {c: 1}}}
    assert.equal(get(obj, ['a', 'c'], 3), 3)
  })
})
