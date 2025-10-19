/**
 * ansi colors
 */

const {
  env = {},
  argv = [],
  platform = '',
  stdout = { isTTY: false },
} = typeof process === 'undefined' ? {} : process

const isDisabled = 'NO_COLOR' in env || argv.includes('--no-color')
const isForced = 'FORCE_COLOR' in env || argv.includes('--color')
const isWindows = platform === 'win32'
const isDumbTerminal = env.TERM === 'dumb'

const isCompatibleTerminal = stdout.isTTY && env.TERM && !isDumbTerminal

const isCI =
  'CI' in env &&
  ('GITHUB_ACTIONS' in env || 'GITLAB_CI' in env || 'CIRCLECI' in env)

export const isColorSupported =
  !isDisabled &&
  (isForced || (isWindows && !isDumbTerminal) || isCompatibleTerminal || isCI)

const esc = (s) => '\u001b[' + (isNaN(s) ? s : s + 'm')

// modifier
export const resetAll = esc`0`
export const bold = esc`1`
export const dim = esc`2`
export const italic = esc`3`
export const underline = esc`4`
export const inverse = esc`7`
export const hidden = esc`8`
export const strikethrough = esc`9`

// colors
export const black = esc`30`
export const red = esc`31`
export const green = esc`32`
export const yellow = esc`33`
export const blue = esc`34`
export const magenta = esc`35`
export const cyan = esc`36`
export const white = esc`37`
export const gray = esc`90`
export const blackBright = esc`90`
export const redBright = esc`91`
export const greenBright = esc`92`
export const yellowBright = esc`93`
export const blueBright = esc`94`
export const magentaBright = esc`95`
export const cyanBright = esc`96`
export const whiteBright = esc`97`
export const reset = esc`39`

// background colors
export const bgBlack = esc`40`
export const bgRed = esc`41`
export const bgGreen = esc`42`
export const bgYellow = esc`43`
export const bgBlue = esc`44`
export const bgMagenta = esc`45`
export const bgCyan = esc`46`
export const bgWhite = esc`47`
export const bgBlackBright = esc`100`
export const bgRedBright = esc`101`
export const bgGreenBright = esc`102`
export const bgYellowBright = esc`103`
export const bgBlueBright = esc`104`
export const bgMagentaBright = esc`105`
export const bgCyanBright = esc`106`
export const bgWhiteBright = esc`107`
export const bgReset = esc`49`
export const bgExpand = esc`K`
