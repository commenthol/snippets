/**
 * construction of __filename and __dirname in es module
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

export const getDirname = (meta) => path.dirname(fileURLToPath(meta))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * replacement for `require.main === module`
 */
if (process.argv[1] === __filename) {
  // eslint-disable-next-line no-console
  console.log({ __filename, __dirname })
}

// get parent path uri
console.log(new URL('..', import.meta.url).href)

// get relative file uri
console.log(new URL('../index.js', import.meta.url).href)

// loading files
console.log(fs.readFileSync(new URL('../index.js', import.meta.url), 'UTF-8'))
