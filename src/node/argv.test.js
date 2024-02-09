import assert from 'assert'
import { resolve } from 'path'
import { argv } from './argv.js'

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
  it('shall expand joined short arguments', function () {
    const cmd = argv('-abvt todo'.split(/ /))
    assert.deepStrictEqual(cmd, {
      a: true,
      b: true,
      todo: 'todo',
      version: true,
      files: []
    })
  })
  it('shall set arg to true if next arg is a command', function () {
    const cmd = argv('-t -a'.split(/ /))
    assert.deepStrictEqual(cmd, {
      a: true,
      todo: true,
      files: []
    })
  })
})
