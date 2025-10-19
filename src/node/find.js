import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

/**
 * recursive find of files and directories
 * @param {string} filename
 * @param {RegExp} filter
 * @param {string} type - if 'd' only filter directories
 */
export async function find(dirname, filter, type) {
  const dirents = await promisify(fs.readdir)(dirname, { withFileTypes: true })
  const dontFilter = (name) => !filter || (filter && filter.test(name))
  const files = []

  for (const dirent of dirents) {
    const name = path.join(dirname, dirent.name)
    if (dirent.isDirectory()) {
      if (type === 'd' && dontFilter(name)) {
        files.push(name)
      }
      const dirfiles = await find(name, filter, type)
      dirfiles.forEach((file) => files.push(file))
    } else if (type !== 'd' && dontFilter(name)) {
      files.push(name)
    }
  }
  return files
}
