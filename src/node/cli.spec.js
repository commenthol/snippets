import assert from 'assert'
import { cli } from './cli.js'

describe('node/cli', function () {
  const cmmds = {
    help: { short: '-h', long: '--help', help: 'this help' },
    version: { short: '-v', long: '--version', help: 'display version' },
    todo: { short: '-t', long: '--todo', type: 'string', help: 'add todo' },
    a: { long: '--rm', help: 'remove all' }
  }

  const helptext =
    '\n    Usage: myprg [options]\n\n    -h, --help                this help\n    -v, --version             display version\n    -t, --todo     string     add todo\n      , --rm                  remove all\n'

  it('shall parse arguments', function () {
    const cmd = cli(
      cmmds,
      '--help --version --todo todo file1 file2'.split(/ /)
    )
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      hasArgs: true,
      helptext
    })
    // console.log(JSON.stringify(_helptext()))
  })
  it('shall parse short arguments', function () {
    const cmd = cli(
      cmmds,
      '-h file1 -v file2 -t todo'.split(/ /)
    )
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      hasArgs: true,
      helptext
    })
  })

  it('shall expand short arguments', function () {
    const cmd = cli(
      cmmds,
      '-hvt todo file1 file2'.split(/ /)
    )
    assert.deepStrictEqual(cmd, {
      args: ['file1', 'file2'],
      help: true,
      todo: 'todo',
      version: true,
      hasArgs: true,
      helptext
    })
  })

  it('shall ignore missing option', function () {
    const cmd = cli(cmmds, '-t -v'.split(/ /))
    assert.deepStrictEqual(cmd, {
      todo: true,
      version: true,
      hasArgs: true,
      helptext
    })
  })

  it('shall replace missing option with default', function () {
    const _cmmds = { ...cmmds, a: { short: '-a', type: 'number', def: 42 } }
    const cmd = cli(_cmmds, '-tva'.split(/ /))
    assert.deepStrictEqual(cmd, {
      todo: true,
      version: true,
      a: 42,
      hasArgs: true,
      helptext:
        '\n    Usage: myprg [options]\n\n    -h, --help                this help\n    -v, --version             display version\n    -t, --todo     string     add todo\n    -a,            number     \n'
    })
  })
})
