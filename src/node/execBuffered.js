/**
 * SPDX-License-Identifier: Unlicense
 * @copyright commenthol (https://github.com/commenthol/snippets)
 */

import { spawn } from 'child_process'

/**
 * @see https://nodejs.org/dist/latest/docs/api/child_process.html#child_processspawncommand-args-options
 * @typedef {import('child_process').SpawnOptions} SpawnOptions
 */
/**
 * @typedef {{input: string | Buffer | undefined}} InputOpt
 * @typedef {SpawnOptions & InputOpt} ExecOptions
 */

/**
 * buffered spawn for stdio and stderr
 * @param {string} command
 * @param {ExecOptions} opts
 * @returns {Promise<Buffer>}
 */
export function execBuffered (command, opts) {
  const { input, ..._opts } = opts || {}
  const [cmd, ...args] = command.split(/\s+/)

  let stdout = Buffer.from('')
  let stderr = Buffer.from('')

  return new Promise((resolve, reject) => {
    const sub = spawn(cmd, args, _opts)

    const handleError = (err) => {
      // @ts-ignore
      err.stderr = stderr.toString()
      reject(err)
    }

    if (!sub.stdin || !sub.stdout || !sub.stderr) {
      handleError(new Error('stdio not available'))
      return
    }

    sub.stdout.on('data', (data) => {
      stdout = Buffer.concat([stdout, data])
    })
    sub.stdout.on('error', handleError)
    sub.stderr.on('data', (data) => {
      stderr = Buffer.concat([stderr, data])
    })
    sub.stderr.on('error', handleError)

    sub.on('close', (code) => {
      console.debug(
        'code=%s stdout=%j stderr=%j',
        code,
        stdout.toString(),
        stderr.toString()
      )
      if (code !== 0) {
        handleError(new Error(`exit code=${code}`))
        return
      }
      resolve(stdout)
    })
    sub.on('error', handleError)

    if (input) {
      sub.stdin.on('error', handleError)
      sub.stdin.write(input)
      sub.stdin.end()
    }
  })
}
