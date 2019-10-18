import path from 'path'
import assert from 'assert'
import { find } from '../../src/node'

describe('node/mkdirp', () => {
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
