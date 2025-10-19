import { exec as execCb } from 'node:child_process'

/** @typedef {import('node:child_process').ExecOptions} ExecOptions */

/**
 * spawns a shell and executes `cmd`; there is no intermediate output available;
 * @see https://github.com/nodejs/node/blob/master/lib/child_process.js
 * @see https://nodejs.org/docs/latest/api/child_process.html
 * @param {string} cmd
 * @param {ExecOptions} opts
 * @returns {Promise<string>}
 */
export function exec(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    execCb(cmd, opts, (err, stdout) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stdout.toString().trim())
    })
  })
}
