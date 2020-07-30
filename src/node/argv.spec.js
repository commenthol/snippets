const assert = require('assert')
const { resolve } = require('path')
const argv = require('./argv.js')

describe('node/argv', function () {
  it('shall parse arguments', function () {
    const cmd = argv('--help --version --todo todo file1 file2'.split(/ /))
    assert.deepStrictEqual(cmd, {
      files: [
        resolve(process.cwd(), 'file1'),
        resolve(process.cwd(), 'file2')
      ],
      help: true,
      todo: 'todo',
      version: true
    })
  })
  it('shall parse short arguments', function () {
    const cmd = argv('-h file1 -v file2 -t todo'.split(/ /))
    assert.deepStrictEqual(cmd, {
      files: [
        resolve(process.cwd(), 'file1'),
        resolve(process.cwd(), 'file2')
      ],
      help: true,
      todo: 'todo',
      version: true
    })
  })
})
