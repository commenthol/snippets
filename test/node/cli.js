const assert = require('assert')
const { cli } = require('../../src/node/cli.js')

describe('argv', function () {
  const cmmds = {
    help: ['-h', '--help', false, 'this help'],
    version: ['-v', '--version', false, 'display version'],
    todo: ['-t', '--todo', 'string', 'add todo']
  }
  it('shall parse arguments', function () {
    const { _helptext, ...cmd } = cli(cmmds, '--help --version --todo todo file1 file2'.split(/ /))
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      _hasArgs: true
    })
    // console.log(JSON.stringify(_helptext()))
    assert.strictEqual(_helptext(), '\n    Usage: myprg [options]\n\n    -h  --help               this help\n    -v  --version            display version\n    -t  --todo     <string>  add todo\n')
  })
  it('shall parse short arguments', function () {
    const { _helptext, ...cmd } = cli(cmmds, '-h file1 -v file2 -t todo'.split(/ /))
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      _hasArgs: true
    })
  })
})
