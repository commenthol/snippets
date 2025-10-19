/**
 * Setup script to install only necessary dependencies while ignoring npm
 * install scripts for enhanced security.
 *
 * Use together with `npm config set ignore-scripts true` to avoid automatic
 * execution of install scripts when installing packages.
 */

import { createRequire } from 'module'
import { execSync } from 'child_process'
import process from 'process'
import path from 'path'

const cd = (dir) => process.chdir(dir)

const exec = (cmd, opts) => execSync(cmd, { stdio: 'inherit', ...opts })

/**
 * @param {string} packageName
 * @param {string|URL} [cwd=''] URL must be absolute file url, string is path
 * relative to process.cwd()
 */
const setup = (packageName, cwd = '') => {
  const dirname =
    cwd instanceof URL ? cwd : path.resolve(process.cwd(), cwd) + path.sep
  const packageDir = createRequire(dirname)
    .resolve(`${packageName}/package.json`)
    .replace(/\/package\.json$/, '')
  cd(packageDir)
  exec('pnpm install')
  exec('pnpm rebuild')
}

// example usage with sqlite3
setup('sqlite3')
