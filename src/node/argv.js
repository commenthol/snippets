// SPDX-License-Identifier: Unlicense

/**
 * @param {object} [opts]
 * @param {Record<string, any>} [opts.def] default cmd object
 * @param {Record<string, string>} [opts.short] shortcodes by cmd key e.g. {'-h': 'help'}
 * @param {Record<string, StringConstructor|BooleanConstructor|NumberConstructor|string>} [opts.types] required type for arg e.g. {'port': Number}
 * @param {string[]} [args] CLI arguments
 * @returns {{
 *  args: string[]|[]
 * } | Record<string, string|boolean|number>}
 * @example
 * ```js
 * const help = `
 *   usage:
 *     prg [options] args
 *
 *   options:
 *     -h,--help             this help
 *     -p,--port <port>      use different port
 *     -t,--task <string>    define task
 * `
 * const cmd = argv({
 *   short: { '-p': 'port', '-h': 'help', '-t': 'to' },
 *   types: { port: Number, to: String }, // define switch types
 *   def: { port: 1234 }, // defaults
 * })
 * if (cmd.help) {
 *   console.log(help)
 *   process.exit()
 * }
 * ```
 */
export function argv(opts, args) {
  const { def, short, types } = opts || {}
  const argv = expand(args || process.argv.slice(2))
  /**
   * @type {{args: string[]|[]} | Record<string, string|boolean|number>}
   */
  const cmd = {
    args: [],
    ...def,
  }

  while (argv.length) {
    const arg = argv.shift() ?? ''

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

    // @ts-expect-error
    cmd.args.push(arg)
  }

  return cmd
}

/**
 * expands joined cli options, e.g. `-abc` => `-a -b -c`
 * @param {string[]} argv
 * @returns {string[]}
 */
function expand(argv) {
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
 * @param {string[]} argv
 * @returns {string|undefined}
 */
function nextArg(argv) {
  const next = argv[0]
  if (typeof next !== 'string' || next.indexOf('-') === 0) {
    return
  }
  return argv.shift()
}

/**
 * type conversion
 * @param {string} [arg]
 * @param {BooleanConstructor|NumberConstructor|StringConstructor|string} [type]
 * @returns
 */
function toType(arg, type) {
  const t = typeof type
  if (type === undefined) {
    return arg
  }
  if (t === 'boolean' || type === Boolean) {
    return arg === 'true'
  }
  if (t === 'number' || type === Number) {
    const n = Number(arg)
    return isNaN(n) ? undefined : n
  }
  return arg
}
