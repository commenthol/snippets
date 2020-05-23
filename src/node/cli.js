
/**
 * a cli commander
 * @type {Object}
 * @example
 * const cmmds = {
 *   //     short, long, args, helptext, default value
 *   help: ['-h', '--help', false, 'this help'],
 *   test: ['-t', '--test', 'string', 'test', 'this is a test'],
 * }
 * cli(cmmds, []) // { test: 'this is a test', _hasArgs: false, _helptext: () => '' }
 * cli(cmmds, ['--test', 'hi world']) // { test: 'hi world', _hasArgs: true, _helptext: () => '' }
*/
exports.cli = (cmmds, argv = process.argv.slice(2)) => {
  const maxLengths = []
  const _helptext = () => '\n    Usage: myprg [options]\n\n' +
    Object.values(cmmds)
      .map(([short = '', long = '', option = '', line = '']) => ([
        '    ',
        short.padEnd(maxLengths[0] + 2),
        long.padEnd(maxLengths[1] + 2),
        (option ? `<${option}>` : '').padEnd(maxLengths[2] + 4),
        line
      ].join('')))
      .join('\n') + '\n'
  const cmd = {
    _helptext
  }
  const map = Object.entries(cmmds).reduce((o, [key, vals]) => {
    const [short, long, shift, help, def] = vals // eslint-disable-line no-unused-vars
    vals.forEach((v, i) => {
      if (typeof v === 'string') maxLengths[i] = Math.max(v.length, maxLengths[i] || 0)
    })
    if (def) cmd[key] = def
    o[short] = o[long] = () => {
      cmd[key] = shift ? argv.shift() : true
    }
    return o
  }, {})
  while (argv.length) {
    const arg = argv.shift()
    const found = map[arg]
    if (found) {
      cmd._hasArgs = true
      found()
    } else {
      cmd.args = (cmd.args || []).concat(arg)
    }
  }
  return cmd
}
