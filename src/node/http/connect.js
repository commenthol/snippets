import util from 'util'

const { isAsyncFunction } = util.types

/**
 * (express) connect pattern to connect (connect) middlewares
 * @param {function[]} handlers
 * @return {function}
 */
export const connect = (...handlers) => (req, res, done) => {
  const stack = handlers
    .map(fn => {
      if (typeof fn !== 'function') throw new Error('need function')
      const length = fn.length
      if (length < 2 || length > 4) throw new Error('function needs arity between 2..4')
      const isAsync = isAsyncFunction(fn)
      return [fn, length, isAsync]
    })

  let i = 0

  function next (err) {
    const [fn, length, isAsync] = stack[i++] || []

    if (res.finished || !fn) {
      done && done(err, req, res)
      return
    }

    try {
      switch (length) {
        case 2: {
          if (err) {
            next(err)
            return
          }
          const p = fn(req, res, next)
          if (isAsync || p?.then) {
            p.then(() => next()).catch(next)
          }
          break
        }
        case 4: {
          err ? fn(err, req, res, next) : next()
          break
        }
        default: { // case 3:
          if (err) {
            isAsync
              ? fn(err, req, res).then(() => next()).catch(next)
              : next(err)
          } else {
            isAsync
              ? next(null)
              // @ts-ignore
              : fn(req, res, next)
          }
          break
        }
      }
    } catch (e) {
      next(e)
    }
  }

  next()
}

// module.exports = connect
export default connect
