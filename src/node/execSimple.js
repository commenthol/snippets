/**
 * SPDX-License-Identifier: Unlicense
 * @copyright commenthol (https://github.com/commenthol/snippets)
 */

import { spawn } from 'child_process'

/**
 * simple spawn
 * @param {string} command
 * @param {Record<string, any>} opts see https://nodejs.org/dist/latest/docs/api/child_process.html#child_processspawncommand-args-options
 * @param {boolean} [opts.async] return a Promise
 * @param {boolean} [opts.silent] no output
 * @returns {Promise<void>|ChildProcess}
 */
export function execSimple(command, opts = {}) {
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
