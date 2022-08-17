/**
 * construction of __filename and __dirname in es module
 */

import path from 'path'
import { fileURLToPath } from 'url'

export const getDirname = (meta) => path.dirname(fileURLToPath(meta))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (process.argv[1] === __filename) {
  // eslint-disable-next-line no-console
  console.log({ __filename, __dirname })
}
