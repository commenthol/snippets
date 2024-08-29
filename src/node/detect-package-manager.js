// SPDX-License-Identifier: Unlicense
/**
 * Detect used package manager in a project.
 * Needs [shelljs](https://www.npmjs.com/package/shelljs) package.
 * Should run in the directory where the projects package.json resides.
 * 1. Checks first if packageManager is set in package.json by corepack
 * 2. Then directories are traversed in search for lock files or workspace
 *    settings
 * 3. If nothing is found then a globally installed exec file is searched
 */

import sh from 'shelljs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const { cat, test, which } = sh

export const PACKAGE_MANAGERS = ['pnpm', 'yarn', 'bun', 'cnpm', 'npm']

const packageJson = (dirname = '.') => {
  const data = cat(path.join(dirname, 'package.json'))
  if (!data || data.stderr) {
    return {}
  }
  return JSON.parse(data)
}

const checkCorePack = (dirname = '.') => {
  const { packageManager = '' } = packageJson(dirname)
  if (!packageManager) {
    return
  }

  for (const pckMan of PACKAGE_MANAGERS) {
    // check corePack package.json.packageManager
    if (packageManager.startsWith(pckMan)) {
      return pckMan
    }
  }
}

const checkFeatures = (dirname = '.') => {
  for (const pckMan of PACKAGE_MANAGERS) {
    if (pckMan === 'pnpm') {
      if (test('-f', path.join(dirname, 'pnpm-lock.yaml'))) {
        return pckMan
      }
      // search for workspace setup
      if (test('-f', path.join(dirname, 'pnpm-workspace.yaml'))) {
        return pckMan
      }
    }
    if (pckMan === 'yarn') {
      if (test('-f', path.join(dirname, 'yarn.lock'))) {
        return pckMan
      }
    }
    if (['cnpm', 'npm'].includes(pckMan)) {
      // npm alternative might not be installed...
      if (!which(pckMan)) {
        continue
      }
      if (test('-f', path.join(dirname, 'package-lock.json'))) {
        return pckMan
      }
    }
  }
}

const checkDirTree = () => {
  const tree = process.cwd().split(path.sep)
  while (tree.length) {
    const dirname = tree.join(path.sep)
    const found = checkCorePack(dirname) || checkFeatures(dirname)
    if (found) {
      return found
    }
    tree.pop()
  }
}

const checkGlobalInstall = () => {
  for (const pckMan of PACKAGE_MANAGERS) {
    // check global install
    if (which(pckMan)) {
      return pckMan
    }
  }
}

export const detectPackageManager = () => {
  sh.config.silent = true
  const pckMan = checkDirTree() || checkGlobalInstall() || 'npm'
  sh.config.silent = false
  return pckMan
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(detectPackageManager())
}
