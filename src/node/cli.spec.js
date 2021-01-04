const assert = require('assert')
const { cli } = require('./cli.js')

describe('node/cli', function () {
  const cmmds = {
    help: ['-h', '--help', false, 'this help'],
    version: ['-v', '--version', false, 'display version'],
    todo: ['-t', '--todo', 'string', 'add todo']
  }
  it('shall parse arguments', function () {
    const cmd = cli(cmmds, '--help --version --todo todo file1 file2'.split(/ /))
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      hasArgs: true,
      helptext: '\n    Usage: myprg [options]\n\n    -h, --help                this help\n    -v, --version             display version\n    -t, --todo     string     add todo\n'
    })
    // console.log(JSON.stringify(_helptext()))
  })
  it('shall parse short arguments', function () {
    const { _helptext, ...cmd } = cli(cmmds, '-h file1 -v file2 -t todo'.split(/ /))
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      hasArgs: true,
      helptext: '\n    Usage: myprg [options]\n\n    -h, --help                this help\n    -v, --version             display version\n    -t, --todo     string     add todo\n'
    })
  })
})
