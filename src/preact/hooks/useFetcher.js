import { useState, useEffect } from 'preact/hooks'

/**
 * @typedef {object} useFetcherReturn
 * @property {any} data - returned data from fetch
 * @property {Error} error - fetch error
 * @property {boolean} isLoading - isLoading indicator
 * @property {(...args) => void} mutate - mutate arguments
 */

let timerId

/**
 * useFetcher Hook
 * @param {Function} fetchMethod - async fetch method bound to fetcher
 * @param {any[]} [args] - optional method arguments
 * @return {useFetcherReturn}
 */
export function useFetcher(fetchMethod, ...args) {
  const [_args, setArgs] = useState(args)
  const [data, setData] = useState()
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    let isEffectRunning = true

    setLoading(true)
    setError(null)

    async function fetchData() {
      try {
        const data = await fetchMethod(..._args)
        if (!isEffectRunning) {
          // do not update state if effect was unmounted in between
          return
        }
        setData(data)
      } catch (e) {
        setError(e)
      }
      setLoading(false)
    }
    fetchData()

    return () => {
      isEffectRunning = false
    }
  }, _args)

  const mutate = (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setArgs([...args])
    }, 250)
  }

  return { data, error, isLoading, mutate }
}
