
/**
 * (express) connect pattern to connect (connect) middlewares
 * @param {function[]} handlers
 * @return {function}
 */
export const connect = (...handlers) => (req, res, done) => {
  let i = 0

  function next (err) {
    const fn = handlers[i++]

    if (!res.finished && typeof fn === 'function') {
      if (!err) {
        if (fn.length !== 4) {
          try {
            const p = fn(req, res, next)
            // support promises
            if (fn.length === 2) { // prevent mixing next with async functions
              p?.then?.(() => next()).catch(next)
            }
          } catch (e) { next(e) }
        } else {
          next()
        }
      } else {
        if (fn.length === 4) {
          try {
            const p = fn(err, req, res, next)
            // support promises
            p?.then?.(() => next()).catch(next)
          } catch (e) { next(e) }
        } else {
          next(err)
        }
      }
    } else {
      done && done(err)
    }
  }

  next()
}

// module.exports = connect
export default connect
