/* eslint no-console:off */

/**
 * add this somewhere in your code to debug push/ replaceState
 */
;(() => {
  /* global history */
  const wrapPushState = history.pushState
  history.pushState = (...args) => {
    console.log('###history.pushState', args, new Error().stack)
    return wrapPushState.apply(history, args)
  }

  const wrapReplaceState = history.replaceState
  history.replaceState = (...args) => {
    console.log('###history.replaceState', args, new Error().stack)
    return wrapReplaceState.apply(history, args)
  }
})()
