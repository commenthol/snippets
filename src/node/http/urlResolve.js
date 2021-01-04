/**
 * @see https://github.com/mjackson/resolve-pathname
 * @license MIT
 */

const SEP = '/'
const DOT = '.'
const DOTS = '..'

const isAbsolute = (pathname) => pathname.charAt(0) === SEP

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne (list, index) {
  for (let i = index, k = i + 1; k < list.length; i += 1, k += 1) {
    list[i] = list[k]
  }
  list.pop()
}

// This implementation is based heavily on node's url.parse
export function resolve (to, from = '') {
  const toParts = (to && to.split(SEP)) || []
  let fromParts = (from && from.split(SEP)) || []

  const isToAbs = to && isAbsolute(to)
  const isFromAbs = from && isAbsolute(from)
  const mustEndAbs = isToAbs || isFromAbs

  if (isToAbs) { // to is absolute
    fromParts = toParts
  } else if (toParts.length) { // to is relative, drop the filename
    fromParts.pop()
    fromParts = fromParts.concat(toParts)
  }

  if (!fromParts.length) return SEP

  let hasTrailingSlash
  if (fromParts.length) {
    const last = fromParts[fromParts.length - 1]
    hasTrailingSlash = last === DOT || last === DOTS || last === ''
  } else {
    hasTrailingSlash = false
  }

  let up = 0
  for (let i = fromParts.length; i >= 0; i--) {
    const part = fromParts[i]

    if (part === DOT) {
      spliceOne(fromParts, i)
    } else if (part === DOTS) {
      spliceOne(fromParts, i)
      up++
    } else if (up) {
      spliceOne(fromParts, i)
      up--
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift(DOTS)

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  ) { fromParts.unshift('') }

  let result = fromParts.join(SEP)

  if (hasTrailingSlash && result.substr(-1) !== SEP) result += SEP

  return result
}
