/**
 * SPDX-License-Identifier: Unlicense
 * @copyright commenthol (https://github.com/commenthol/snippets)
 */

import { spawn } from 'node:child_process'

/** @typedef {import('node:child_process').ChildProcessWithoutNullStreams} ChildProcessWithoutNullStreams */
/** @typedef {import('node:child_process').SpawnOptionsWithoutStdio} SpawnOptionsWithoutStdio */
/**
 * @typedef {object} Options
 * @property {boolean} [async] return a Promise
 * @property {boolean} [silent] no output
 */
/** @typedef {SpawnOptionsWithoutStdio & Options} ExecSimpleOptions */

/**
 * simple spawn
 * @param {string} command
 * @param {ExecSimpleOptions} [opts]
 * @returns {Promise<void>|ChildProcessWithoutNullStreams}
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
