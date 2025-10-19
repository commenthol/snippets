import util from 'util'

const { isAsyncFunction } = util.types

// modifier + colors
const esc = (s) => '\u001b[' + (isNaN(s) ? s : s + 'm')
export const resetAll = esc`0`
export const bold = esc`1`
export const red = esc`31`
export const green = esc`32`
export const cyan = esc`36`

let tests

/**
 * simple mocha runner
 * @note describe blocks run in parallel
 */
export function describe(suite, fn) {
  if (!(this instanceof describe)) {
    return new describe(suite, fn)
  }

  const self = this
  let length = 0
  tests = this.tests = []

  fn.call(this)
  run()

  function run() {
    const { fn, name } = self.tests[length++] || {}
    if (fn) {
      try {
        if (fn.length) {
          // callback
          fn(done.bind(fn, name))
        } else {
          // sync or promises
          const p = fn()
          if (isAsyncFunction(fn) || p?.then) {
            p.then(() => done(name)).catch((err) => done(name, err))
          } else {
            done(name)
          }
        }
      } catch (err) {
        done(name, err)
      }
    }
  }

  function done(name, err) {
    if (err) {
      const { message, actual, expected, stack } = err
      console.error(
        `${red}${bold}FAIL${resetAll} - ${bold}${suite}${resetAll} - ${red}${name}${resetAll}`
      )
      const SPACE = '    '
      const msg = [
        SPACE + message,
        stack
          .split('\n')
          .slice(1, 3)
          .join('\n' + SPACE),
        `actual:   ${actual}`,
        `expected: ${expected}`,
      ].join('\n' + SPACE)

      console.error(msg)
    } else {
      console.log(
        `${green}${bold}OK  ${resetAll} - ${bold}${suite}${resetAll} - ${green}${name}${resetAll}`
      )
    }
    process.nextTick(run)
  }
}

describe.skip = (suite, _fn) => {
  console.log(`${cyan}${bold}SKIP${resetAll} - ${bold}${suite}${resetAll}`)
}

export function it(name, fn) {
  tests.push({ name, fn })
}

it.skip = (name, _fn) => {
  console.log(`${cyan}${bold}SKIP${resetAll} - ${bold}${name}${resetAll}`)
}
