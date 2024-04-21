import assert from 'assert'
import { argv } from './argv.js'

describe('node/argv', function () {
  it('shall parse arguments', function () {
    const cmd = argv({}, '--help --version --todo todo file1 file2'.split(/ /))
    assert.deepStrictEqual(cmd, {
      args: ['todo', 'file1', 'file2'],
      help: true,
      version: true,
      todo: true
    })
  })
  it('shall parse short arguments', function () {
    const cmd = argv(
      {
        short: { '-h': 'help', '-v': 'version', '-t': 'todo' },
        types: { todo: String }
      },
      '-h file1 -v file2 -t todo'.split(/ /)
    )
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      version: true,
      todo: 'todo'
    })
  })
  it('shall expand joined short arguments', function () {
    const cmd = argv({
      short: {
        '-a': 'a',
        '-b': 'b',
        '-h': 'help',
        '-v': 'version',
        '-t': 'todo'
      },
      types: { todo: String }
    }, '-abvt todo'.split(/ /))
    assert.deepStrictEqual(cmd, {
      a: true,
      b: true,
      todo: 'todo',
      version: true,
      args: []
    })
  })
  it('shall set arg to true if next arg is a command', function () {
    const cmd = argv(
      {
        short: {
          '-a': 'a',
          '-b': 'b',
          '-h': 'help',
          '-v': 'version',
          '-t': 'todo'
        }
      },
      '-t -a'.split(/ /)
    )
    assert.deepStrictEqual(cmd, {
      a: true,
      todo: true,
      args: []
    })
  })
})
