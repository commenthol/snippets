import assert from 'node:assert'
import {
  resetAll,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  reset,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
  bgReset,
  bgExpand,
} from './colors.js'

describe('node/colors', function () {
  it('shall display colors', function () {
    const s = [
      black,
      '##',
      red,
      '##',
      green,
      '##',
      yellow,
      '##',
      blue,
      '##',
      magenta,
      '##',
      cyan,
      '##',
      white,
      '##',
      gray,
      '##',
      blackBright,
      '##',
      redBright,
      '##',
      greenBright,
      '##',
      yellowBright,
      '##',
      blueBright,
      '##',
      magentaBright,
      '##',
      cyanBright,
      '##',
      whiteBright,
      '##',
      reset,
      resetAll,
    ].join('')
    console.log(s)
    assert.strictEqual(
      s,
      '\u001b[30m##\u001b[31m##\u001b[32m##\u001b[33m##\u001b[34m##\u001b[35m##\u001b[36m##\u001b[37m##\u001b[90m##\u001b[90m##\u001b[91m##\u001b[92m##\u001b[93m##\u001b[94m##\u001b[95m##\u001b[96m##\u001b[97m##\u001b[39m\u001b[0m'
    )
  })

  it('shall display bg colors', function () {
    const s = [
      white,
      bgBlack,
      '##',
      bgRed,
      '##',
      bgGreen,
      '##',
      bgYellow,
      '##',
      bgBlue,
      '##',
      bgMagenta,
      '##',
      bgCyan,
      '##',
      black,
      bgWhite,
      '##',
      bgWhite,
      '##',
      white,
      bgBlackBright,
      '##',
      bgRedBright,
      '##',
      black,
      bgGreenBright,
      '##',
      bgYellowBright,
      '##',
      white,
      bgBlueBright,
      '##',
      bgMagentaBright,
      '##',
      black,
      bgCyanBright,
      '##',
      bgWhiteBright,
      '##',
      bgReset,
    ].join('')
    console.log(s)
    assert.strictEqual(
      s,
      '\u001b[37m\u001b[40m##\u001b[41m##\u001b[42m##\u001b[43m##\u001b[44m##\u001b[45m##\u001b[46m##\u001b[30m\u001b[47m##\u001b[47m##\u001b[37m\u001b[100m##\u001b[101m##\u001b[30m\u001b[102m##\u001b[103m##\u001b[37m\u001b[104m##\u001b[105m##\u001b[30m\u001b[106m##\u001b[107m##\u001b[49m'
    )
  })

  it('shall expand bg', function () {
    const s = [bgCyanBright, bgExpand, 'ABCDEF', bgReset].join('')
    console.log(s)
    assert.strictEqual(s, '\u001b[106m\u001b[KABCDEF\u001b[49m')
  })
})
