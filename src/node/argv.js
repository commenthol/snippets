/**
 * @param {string[]} [args] CLI arguments; if args is not an array then opts is used instead
 * @param {object} [opts]
 * @param {Record<string, any>} [opts.def] default cmd object
 * @param {Record<string, string>} [opts.short] shortcodes by cmd key e.g. {'-h': 'help'}
 * @param {Record<string, String|Boolean|Number>} [opts.types] required type for arg e.g. {'port': Number}
 * @returns {Record<string, string|number|boolean>}
 */
export function argv (args, opts) {
  if (!Array.isArray(args)) {
    opts = args
    args = undefined
  }
  const { def, short, types } = opts || {}
  const argv = expand(args || process.argv.slice(2))
  const cmd = { args: [], ...def }

  while (argv.length) {
    const arg = argv.shift()

    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const type = types?.[key]
      cmd[key] = type ? toType(nextArg(argv), type) : true
      continue
    }

    if (short?.[arg]) {
      const key = short[arg]
      const type = types?.[key]
      cmd[key] = type ? toType(nextArg(argv), type) : true
      continue
    }

    cmd.args.push(arg)
  }

  return cmd
}

/**
 * expands joined cli options, e.g. `-abc` => `-a -b -c`
 * @param {string[]} argv
 * @returns {string[]}
 */
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

/**
 * checks next argument
 * @param {string} argv
 * @returns {string|undefined}
 */
function nextArg (argv) {
  const next = argv[0]
  if (typeof next !== 'string' || next.indexOf('-') === 0) {
    return
  }
  return argv.shift()
}

/**
 * type conversion
 * @param {string} arg
 * @param {Boolean|Number|String} [type]
 * @returns
 */
function toType (arg, type) {
  if (type === undefined) {
    return arg
  }
  if (type === Boolean) {
    return arg === 'true'
  }
  if (type === Number) {
    const n = Number(arg)
    return isNaN(n) ? undefined : n
  }
  return arg
}
