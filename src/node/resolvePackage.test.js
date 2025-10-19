import path from 'path'
import assert from 'assert'
import { resolvePackage } from './resolvePackage.js'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(
  /\/$/,
  ''
)

describe('node/resolvePackage', () => {
  it('should find package.json for debug', async () => {
    const pathname = await resolvePackage('debug')
    const dir = path.resolve(__dirname, '../../..')
    const shortPathname = pathname.substring(dir.length)
    assert.strictEqual(
      shortPathname,
      '/snippets/node_modules/debug/package.json'
    )
  })
})
