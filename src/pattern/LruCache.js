/**
 * @template T
 */
export class LruCache {
  /**
   * @param {number} maxSize - maximum number of entries in the cache
   */
  constructor(maxSize) {
    this._maxSize = maxSize
    /** @type {Map<string, T>} */
    this._cache = new Map()
  }

  /**
   * Returns the number of items currently in the cache.
   * @returns {number}
   */
  get size() {
    return this._cache.size
  }

  /**
   * Retrieves a value from the cache.
   * @param {string} key - The key of the item to retrieve.
   * @returns {T | undefined} The value associated with the key, or undefined if not found.
   */
  get(key) {
    const value = this._cache.get(key)
    if (value !== undefined) {
      // move to the end to show that it was recently used
      this._cache.delete(key)
      this._cache.set(key, value)
    }
    return value
  }

  /**
   * Adds a value to the cache.
   * @param {string} key - The key of the item to add.
   * @param {T} value - The value to add.
   */
  set(key, value) {
    if (this._cache.size >= this._maxSize) {
      // remove the least recently used item
      const firstKey = this._cache.keys().next().value
      firstKey && this._cache.delete(firstKey)
    }
    this._cache.set(key, value)
  }

  /**
   * Deletes a value from the cache.
   * @param {string} key - The key of the item to delete.
   */
  delete(key) {
    this._cache.delete(key)
  }

  /**
   * Clears all items from the cache.
   */
  clear() {
    this._cache.clear()
  }
}
