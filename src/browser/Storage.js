const hasWindow = typeof window !== 'undefined'

class StorageInterface {
  get length () { return 0 }

  clear () {}

  getItem () {}

  key () {}

  removeItem () {}

  setItem () {}
}

/**
 * Storage class which encodes values to JSON an back
 */
class Storage extends StorageInterface {
  constructor (store) {
    super()
    this.store = store
  }

  get length () {
    return this.store.length
  }

  clear () {
    return this.store.clear()
  }

  getItem (key) {
    const value = this.store.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }

  key (index) {
    return this.store.key(index)
  }

  removeItem (key) {
    return this.store.removeItem(key)
  }

  setItem (key, value) {
    if (value === null || value === undefined) {
      return this.store.removeItem(key)
    }
    const _value = typeof value === 'object'
      ? JSON.stringify(value)
      : value
    return this.store.setItem(key, _value)
  }
}

class MemoryStore extends StorageInterface {
  constructor () {
    super()
    this.store = {}
  }

  get length () {
    return Object.keys(this.store).length
  }

  clear () {
    this.store = {}
  }

  getItem (key) {
    return this.store[key]
  }

  key (index) {
    const key = Object.keys(this.store)[index]
    if (key !== undefined) {
      return this.getItem(key)
    }
  }

  removeItem (key) {
    delete this.store[key]
  }

  setItem (key, value) {
    this.store[key] = value
  }
}

export const memoryStore = new MemoryStore()

export const sessionStorage = hasWindow
  ? new Storage(window.sessionStorage)
  : new StorageInterface()

export const localStorage = hasWindow
  ? new Storage(window.localStorage)
  : new StorageInterface()
