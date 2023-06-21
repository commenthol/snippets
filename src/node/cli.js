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
export function cli (cmmds, argv = process.argv.slice(2)) {
  const cmd = { helptext: '\n    Usage: myprg [options]\n\n' }
  const map = Object.entries(cmmds).reduce((o, [key, vals]) => {
    const [short, long, shift, help, def] = vals
    cmd.helptext += `    ${String(short).padEnd(2)}, ${String(long).padEnd(10)} ${(shift || '').padEnd(10)} ${help}\n`
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
      cmd.hasArgs = true
      found()
    } else {
      cmd.args = (cmd.args || []).concat(arg)
    }
  }
  return cmd
}
