import path from 'path'
import assert from 'assert'
import { fileURLToPath } from 'url'
import { find } from './index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '')

describe('node/find', () => {
  it('should find all files in ..', async () => {
    const files = await find(path.resolve(__dirname, '..'))
    assert.ok(files.length > 10)
    assert.ok(files.includes(__filename))
  })
  it('should find all directories in ..', async () => {
    const files = await find(path.resolve(__dirname, '..'), undefined, 'd')
    assert.ok(files.length > 5)
    assert.ok(files.includes(__dirname))
  })
  it('should find all directories in .. starting with /node', async () => {
    const files = await find(path.resolve(__dirname, '..'), /[/\\]node$/, 'd')
    assert.ok(files.length === 1)
    assert.ok(files.includes(__dirname))
  })
})
