/**
 * SPDX-License-Identifier: Unlicense
 * @license Unlicense
 */

import { basename } from 'node:path'

/**
 * @typedef {object} CliOption
 * @property {string} [short] short option
 * @property {string} [long] long option
 * @property {'number'|'string'} [type] type of option
 * @property {number|string} [def] default option
 * @property {string} [help]
 */
/**
 * @typedef {object} CliHelperOption
 * @property {string} [_helptext]
 * @property {string} [_helptextAppend]
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
 * @param {Record<string, CliOption>|CliHelperOption} cmds
 * @param {string[]|[]} argv
 * @returns {Record<string, boolean|number|string>}
 */
export function cli(cmds, argv = process.argv.slice(2)) {
  const { _helptext, _helptextAppend, ...cmmds } = cmds
  const cmd = {}

  const helpOpts = []
  const max = { long: 0, type: 0 }

  const buildHelpText = () => {
    let text = `\n${
      _helptext || `Usage: ${basename(process.argv[1])} [options]`
    }\n\n`

    const spaces = 26
    for (const [short, long, type, help] of helpOpts) {
      const first = max.long + type.length > spaces
      text +=
        String(short).padEnd(2) +
        (max.long > 0 ? ',' + String(long).padEnd(max.long) : '') +
        (max.type > 0 ? ' ' + String(type).padEnd(max.type) : '') +
        ' ' + indent(help, { spaces, first }) + '\n'
    }

    if (_helptextAppend) {
      text += '\n' + _helptextAppend
    }

    return indent(text)
  }

  const map = Object.entries(cmmds).reduce((o, [key, vals]) => {
    const { short = '', long = '', type = '', help = '', def } = vals
    max.long = Math.max(max.long, long.length)
    max.type = Math.max(max.type, type.length)
    helpOpts.push([short, long, type, help])
    if (def !== undefined) {
      cmd[key] = def
    }
    o[short] = o[long] = () => {
      const val = type ? nextArg(_argv) ?? def ?? true : true
      cmd[key] = type === 'number' ? Number(val) : val
    }
    return o
  }, {})

  cmd.helptext = buildHelpText()

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

function indent(str = '', { spaces = 4, first = true } = {}) {
  const indent = new Array(spaces).fill(' ').join('')
  return str
    .split(/[\r\n]/)
    .map((line, i) => (!first && i === 0 ? '' : indent) + line)
    .join('\n')
}

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

function nextArg(argv) {
  const next = argv[0]
  if (typeof next !== 'string' || next.startsWith('-')) {
    return
  }
  return argv.shift()
}
