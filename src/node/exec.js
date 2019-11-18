/* eslint no-console:off */

const { spawn } = require('child_process')

async function exec (command, args, input) {
  let stdout = Buffer.from('')
  let stderr = Buffer.from('')

  return new Promise((resolve, reject) => {
    const sub = spawn(command, args)

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

module.exports = exec
