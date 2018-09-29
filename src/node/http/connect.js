const connect = (...handlers) => (req, res, done) => {
  let i = 0

  function run (err) {
    const fn = handlers[i++]
    if (typeof fn === 'function') {
      if (err) {
        if (fn.length === 4) {
          fn(err, req, res, saveRun)
        } else {
          run(err)
        }
      } else {
        if (fn.length === 4) {
          run()
        } else {
          fn(req, res, saveRun)
        }
      }
    } else {
      done && done(err)
    }
  }

  function saveRun (err) {
    try {
      run(err)
    } catch (e) {
      run(e)
    }
  }

  saveRun()
}

module.exports = connect
