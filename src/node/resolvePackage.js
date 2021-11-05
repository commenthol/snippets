import fs from 'fs/promises'
import path from 'path'

/**
 * `await import.meta.resolve(specifier)` if `--experimental-import-meta-resolve` is set
 * @param {string} specifier The module `specifier` to resolve relative to `parent`
 * @param {string} [parent] starting directory - default is `process.cwd()`
 * @returns {string|undefined} pathname
 */
export async function resolvePackage (specifier, parent = '') {
  const segments = path.resolve(parent, process.cwd(), parent).split(path.sep)
  const pckg = ['node_modules', specifier, 'package.json']
  while (segments.length) {
    const pckgPath = [...segments, ...pckg].join(path.sep)
    try {
      await fs.stat(pckgPath)
      return pckgPath
    } catch (e) {}
    segments.pop()
  }
}
