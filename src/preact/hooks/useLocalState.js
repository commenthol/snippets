import { useState } from 'preact/hooks'

function assert (val, msg) {
  if (!val) { throw new Error(msg || 'Assertion failed') }
}
const isObject = v => v === Object(v)

const parseJson = (val) => {
  try {
    return JSON.parse(val)
  } catch (e) {
    return null
  }
}

const getItem = (storage, key) => parseJson(storage.getItem(key))

const setItem = (storage, key, val) => storage.setItem(key, JSON.stringify(val))

const _useState = (storage) =>
  /**
   * @param {any} initialValue
   * @param {string} key storage key
   * @returns {[state: any, setState: Function]}
   */
  function _useState (initialValue = false, key) {
    assert(key, 'key needed')

    const [state, _setState] = useState(() => {
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
      return val
    })

    const setState = (val) => {
      setItem(storage, key, val)
      _setState(val)
    }
    return [state, setState]
  }

export const useLocalState = _useState(localStorage)

export const useSessionState = _useState(sessionStorage)
