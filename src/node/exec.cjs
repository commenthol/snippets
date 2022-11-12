/* eslint no-console:off */

const { spawn } = require('child_process')

/**
 * buffered spawn for stdio and stderr
 * @param {string} command
 * @param {Record<string, any>} opts see https://nodejs.org/dist/latest/docs/api/child_process.html#child_processspawncommand-args-options
 * @param {string|Buffer} opts.input
 * @returns {Promise<Buffer>}
 */
function execBuffered (command, opts = {}) {
  const { input, ..._opts } = opts
  const [cmd, ...args] = command.split(/\s+/)

  let stdout = Buffer.from('')
  let stderr = Buffer.from('')

  return new Promise((resolve, reject) => {
    const sub = spawn(cmd, args, _opts)

    const handleError = err => {
      // @ts-ignore
      err.stderr = stderr.toString()
      reject(err)
    }

    sub.stdout.on('data', data => { stdout = Buffer.concat([stdout, data]) })
    sub.stdout.on('error', handleError)
    sub.stderr.on('data', data => { stderr = Buffer.concat([stderr, data]) })
    sub.stderr.on('error', handleError)

    sub.on('close', () => resolve(stdout))
    sub.on('error', handleError)

    if (input) {
      sub.stdin.on('error', handleError)
      sub.stdin.write(input)
      sub.stdin.end()
    }
  })
}

/**
 * simple spawn
 * @param {string} command
 * @param {Record<string, any>} opts see https://nodejs.org/dist/latest/docs/api/child_process.html#child_processspawncommand-args-options
 * @param {boolean} [opts.async] return a Promise
 * @param {boolean} [opts.silent] no output
 * @returns {Promise<void>|ChildProcess}
 */
function execSimple (command, opts = {}) {
  const [cmd, ...args] = command.split(/\s+/)
  const { async: isAsync, silent, ..._opts } = opts
  const sub = spawn(cmd, args, _opts)
  if (!silent) {
    sub.stdout.pipe(process.stdout)
    sub.stderr.pipe(process.stderr)
  }
  if (isAsync) {
    return new Promise((resolve, reject) => {
      sub.on('error', reject)
      sub.on('close', resolve)
      // sub.on('exit', code => {
      //   code > 0
      //     ? reject(new Error('' + code))
      //     : resolve()
      // })
    })
  } else {
    sub.on('error', console.error)
    return sub
  }
}

module.exports = {
  execBuffered,
  execSimple
}
