/**
 * @typedef {object} CliOption
 * @property {string} [short] short option
 * @property {string} [long] long option
 * @property {'number'|'string'} [type] type of option
 * @property {number|string} [def] default option
 * @property {string} [help]
 */

/**
 * a cli commander
 *
 * @example
 * const cmmds = {
 *   help: { short: '-h', long: '--help', help: 'this help' },
 *   test: { short: '-t', long: '--test', type: 'string', def: 'test', help: 'this is a test' },
 * }
 * cli(cmmds, [])
 * // { test: 'this is a test', hasArgs: false, helptext: '\n    Usage: myprg [options]\n\n...' }
 * cli(cmmds, ['--test', 'hi world'])
 * // { test: 'hi world', hasArgs: true, helptext: '\n    Usage: myprg [options]\n\n...' }
 *
 * @param {Record<string, CliOption>} cmmds
 * @param {string[]|[]} argv
 * @returns {Record<string, boolean|number|string>}
 */
export function cli (cmmds, argv = process.argv.slice(2)) {
  const cmd = { helptext: '\n    Usage: myprg [options]\n\n' }

  const map = Object.entries(cmmds).reduce((o, [key, vals]) => {
    const { short = '', long = '', type, help = '', def } = vals
    cmd.helptext += `    ${String(short).padEnd(2)}, ${String(long).padEnd(
      10
    )} ${(type || '').padEnd(10)} ${help}\n`
    if (def !== undefined) {
      cmd[key] = def
    }
    o[short] = o[long] = () => {
      const val = type ? nextArg(_argv) ?? def ?? true : true
      cmd[key] = type === 'number' ? Number(val) : val
    }
    return o
  }, {})

  const _argv = expand(argv)
  while (_argv.length) {
    const arg = _argv.shift()
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

function expand (argv) {
  const nArgv = []
  for (const arg of argv) {
    if (/^-[a-z]+$/.test(arg)) {
      const shortArgs = arg.slice(1).split('')
      for (const short of shortArgs) {
        nArgv.push(`-${short}`)
      }
    } else {
      nArgv.push(arg)
    }
  }
  return nArgv
}

function nextArg (argv) {
  const next = argv[0]
  if (typeof next !== 'string' || next.startsWith('-')) {
    return
  }
  return argv.shift()
}
