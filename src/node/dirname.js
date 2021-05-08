/**
 * construction of __filename and __dirname in es module
 */

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '')

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // eslint-disable-next-line no-console
  console.log({ __filename, __dirname })
}
