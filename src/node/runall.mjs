#!/usr/bin/env node

/**
 * `npm run` with multiple arguments
 * can be used as a simple replacement for [npm-run-all](https://npmjs.org/package/npm-run-all)
 * usage in package.json
 * ```
 * "scripts": { "ci": "node ./runall.mjs lint build test", ... }
 * ```
 */

import { spawn } from 'child_process'

/**
 * @param {string} arg
 * @returns {Promise<void>}
 */
function npmRun(arg) {
  return new Promise((resolve, reject) => {
    const sub = spawn('npm', ['run', arg], { stdio: 'inherit' })
    sub.on('error', (err) => {
      reject(err)
    })
    sub.on('exit', (code) => {
      code > 0 ? reject(new Error('' + code)) : resolve()
    })
  })
}

/**
 * @param {string[]} argv
 */
async function main(argv) {
  for (const arg of argv) {
    await npmRun(arg)
  }
}

main(process.argv.slice(2)).catch((err) => {
  console.error(err.message)
  process.exit(1)
})
