/* eslint no-unused-vars: "off", no-console: "off" */
/**
 * @module node/testing
 * mocha BDD tests with boolean pre-condition
 */

const noop = () => {}

export const isTestSlow = process.env.TEST_SLOW === 'true'
if (!isTestSlow) console.info('run slow tests with `TEST_SLOW=true`')

/**
 * describeBool use instead of describe() for additional checks.
 * If `trueish` is true then test is run otherwise skipped.
 * For development you may want to use `.only` or `.skip` as with describe.
 * Use `.off` to temporarily disable trueish checks
 */
export const describeBool = (trueish) => (trueish ? describe : describe.skip)
describeBool.only = (trueish) => (trueish ? describe.only : noop)
describeBool.skip = (trueish) => describe.skip
describeBool.off = (trueish) => {
  console.warn('WARN: describe.off is set')
  return describe
}

/**
 * itBool use instead of it() for additional checks.
 * If `trueish` is true then test is run otherwise skipped.
 * For development you may want to use `.only` or `.skip` as with it.
 * Use `.off` to temporarily disable trueish checks
 */
export const itBool = (trueish) => (trueish ? it : it.skip)
itBool.only = (trueish) => (trueish ? it.only : noop)
itBool.skip = (trueish) => it.skip
itBool.off = (trueish) => {
  console.warn('WARN: it.off is set')
  return it
}
