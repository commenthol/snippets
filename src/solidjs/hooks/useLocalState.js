import { createSignal } from 'solid-js'

function assert(val, msg) {
  if (!val) {
    throw new Error(msg || 'Assertion failed')
  }
}
const isObject = (v) => v === Object(v)

const parseJson = (val) => {
  try {
    return JSON.parse(val)
  } catch (_err) {
    return null
  }
}

const getItem = (storage, key) => parseJson(storage.getItem(key))

const setItem = (storage, key, val) =>
  val === null
    ? storage.removeItem(key)
    : storage.setItem(key, JSON.stringify(val))

const _useState = (storage) =>
  /**
   * @param {any} initialValue
   * @param {string} key storage key
   * @returns {[state: any, setState: Function]}
   */
  function _useState(initialValue = false, key) {
    assert(key, 'key needed')

    let val = getItem(storage, key)
    if (typeof val !== typeof initialValue) {
      val = null
    }
    if (val == null) {
      val = initialValue
    } else if (isObject(val)) {
      // ensure that initial values are part of the value here
      val = { ...initialValue, ...val }
    }
    setItem(storage, key, val)

    const [state, _setState] = createSignal(val)

    const setState = (val) => {
      setItem(storage, key, val)
      _setState(val)
    }
    return [state, setState]
  }

export class Memory {
  constructor() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] ?? null
  }

  setItem(key, value) {
    this.store[key] = value
  }

  removeItem(key) {
    delete this.store[key]
  }
}

// singleton
export const memory = new Memory()

export const useMemoryState = _useState(memory)

export const useLocalState = _useState(localStorage)

export const useSessionState = _useState(sessionStorage)
