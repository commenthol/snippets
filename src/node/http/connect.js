import util from 'util'

const { isAsyncFunction } = util.types

/**
 * (express) connect pattern to connect (connect) middlewares
 * @param {function[]} handlers
 * @return {function}
 */
export const connect = (...handlers) => (req, res, done) => {
  let i = 0

  const types = handlers
    .map(fn => {
      if (typeof fn !== 'function') throw new Error('need function')
      const length = fn.length
      if (length < 2 || length > 4) throw new Error('function needs arity between 2..4')
      const isAsync = isAsyncFunction(fn)
      return [fn, length, isAsync]
    })

  function next (err) {
    const [fn, length, isAsync] = types[i++] || []

    if (res.finished || !fn) {
      done && done(err)
      return
    }

    try {
      switch (length) {
        case 2: {
          if (err) {
            next(err)
            return
          }
          const p = fn(req, res)
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
            fn(req, res, next)
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
