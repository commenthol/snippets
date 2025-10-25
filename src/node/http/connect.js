import util from 'util'

const { isAsyncFunction } = util.types

/** @typedef {import('./connect-types.js').NextFunction} NextFunction */
/** @typedef {import('./connect-types.js').HandleFunction} HandleFunction */
/** @typedef {import('./connect-types.js').DoneFunction} DoneFunction */

/**
 * (express) connect pattern to connect (connect) middlewares
 * @param {HandleFunction[]} handlers
 * @returns {(req: object, res: object, done?: DoneFunction) => void}
 */
export const connect =
  (...handlers) =>
  (req, res, done) => {
    /** @type {{fn:function, length:number, isAsync:boolean}[]} */
    const stack = handlers.flat(Infinity).map((fn) => {
      if (typeof fn !== 'function') throw new Error('need function')
      const length = fn.length
      if (length < 2 || length > 4)
        throw new Error('function needs arity between 2..4')
      const isAsync = isAsyncFunction(fn)
      return { fn, length, isAsync }
    })

    let i = 0

    function next(err) {
      const { fn, length, isAsync } = stack[i++] || {}

      if (res.writableEnded || !fn) {
        done && done(err, req, res)
        return
      }

      try {
        switch (length) {
          case 2: {
            if (err) {
              next(err)
            } else {
              const p = fn(req, res, next)
              if (isAsync || p?.then) {
                p.then(() => next()).catch(next)
              }
            }
            break
          }
          case 4: {
            err ? fn(err, req, res, next) : next()
            break
          }
          default: {
            // case 3:
            err ? next(err) : fn(req, res, next)
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
