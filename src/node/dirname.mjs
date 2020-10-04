/**
 * construction of __filename and __dirname in js module
 */

import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// eslint-disable-next-line no-console
console.log(__filename, __dirname)
