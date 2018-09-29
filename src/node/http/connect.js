
const runner = (req, res, done, saveRun, fn, err) => {
  if (typeof fn === 'function') {
    if (err) {
      if (fn.length === 4) {
        fn(err, req, res, saveRun)
      } else {
        saveRun(err)
      }
    } else {
      if (fn.length === 4) {
        saveRun()
      } else {
        const p = fn(req, res, saveRun)
        if (p && typeof p.then === 'function') { // Promise support
          p.then(() => saveRun()).catch(saveRun)
        }
      }
    }
  } else {
    done && done(err)
  }
}

const connect = (...handlers) => (req, res, done) => {
  let i = 0
  const run = runner.bind(null, req, res, done, saveRun)

  function saveRun (err) {
    const fn = handlers[i++]
    try {
      run(fn, err)
    } catch (err) {
      run(fn, err)
    }
  }

  saveRun()
}

module.exports = connect
