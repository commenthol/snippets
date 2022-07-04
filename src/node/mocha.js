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
export function describe (suite, fn) {
  if (!(this instanceof describe)) {
    // eslint-disable-next-line new-cap
    return new describe(suite, fn)
  }

  const self = this
  let length = 0
  tests = this.tests = []

  fn.call(this)
  run()

  function run () {
    const { fn, name } = self.tests[length++] || {}
    if (fn) {
      try {
        if (fn.length) { // callback
          fn(done.bind(fn, name))
        } else { // sync or promises
          const p = fn()
          if (isAsyncFunction(fn) || p?.then) {
            p
              .then(() => done(name))
              .catch(err => done(name, err))
          } else {
            done(name)
          }
        }
      } catch (err) {
        done(name, err)
      }
    }
  }

  function done (name, err) {
    if (err) {
      console.log(`${bold}${suite}${resetAll} - ${red}${bold}FAIL - ${red}${name}${resetAll}`)
      console.log(err)
    } else {
      console.log(`${bold}${suite}${resetAll} - ${green}${bold}OK${resetAll} -${green} ${name}${resetAll}`)
    }
    process.nextTick(run)
  }
}

describe.skip = (suite, fn) => {}

export function it (name, fn) {
  tests.push({ name, fn })
}

it.skip = (name, fn) => {}
