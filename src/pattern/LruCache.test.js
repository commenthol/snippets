import assert from 'node:assert'
import { LruCache } from './LruCache.js'

describe('LruCache', () => {
  let cache

  beforeEach(() => {
    cache = new LruCache(3)
  })

  it('should initialize with maxSize', () => {
    assert.strictEqual(cache.size, 0)
  })

  it('should set and get values', () => {
    cache.set('key1', 'value1')
    assert.strictEqual(cache.get('key1'), 'value1')
    assert.strictEqual(cache.size, 1)
  })

  it('should return undefined for non-existent keys', () => {
    assert.strictEqual(cache.get('nonexistent'), undefined)
  })

  it('should evict least recently used item when full', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.set('key3', 'value3')
    assert.strictEqual(cache.size, 3)

    cache.set('key4', 'value4')
    assert.strictEqual(cache.size, 3)
    assert.strictEqual(cache.get('key1'), undefined)
    assert.strictEqual(cache.get('key4'), 'value4')
  })

  it('should move accessed item to end (most recently used)', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.set('key3', 'value3')

    cache.get('key1')
    cache.set('key4', 'value4')

    assert.strictEqual(cache.get('key1'), 'value1')
    assert.strictEqual(cache.get('key2'), undefined)
    assert.strictEqual(cache.get('key3'), 'value3')
    assert.strictEqual(cache.get('key4'), 'value4')
  })

  it('should delete items', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    assert.strictEqual(cache.size, 2)

    cache.delete('key1')
    assert.strictEqual(cache.size, 1)
    assert.strictEqual(cache.get('key1'), undefined)
    assert.strictEqual(cache.get('key2'), 'value2')
  })

  it('should clear all items', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.set('key3', 'value3')
    assert.strictEqual(cache.size, 3)

    cache.clear()
    assert.strictEqual(cache.size, 0)
    assert.strictEqual(cache.get('key1'), undefined)
  })

  it('should handle overwriting existing keys', () => {
    cache.set('key1', 'value1')
    cache.set('key1', 'newvalue1')
    assert.strictEqual(cache.get('key1'), 'newvalue1')
    assert.strictEqual(cache.size, 1)
  })

  it('should work with cache size of 1', () => {
    const smallCache = new LruCache(1)
    smallCache.set('key1', 'value1')
    assert.strictEqual(smallCache.get('key1'), 'value1')

    smallCache.set('key2', 'value2')
    assert.strictEqual(smallCache.get('key1'), undefined)
    assert.strictEqual(smallCache.get('key2'), 'value2')
  })
})
