import assert from 'assert'
import { random, randomInt } from './index.js'

const assertRange = (result, expLower, expUpper, isInteger) => {
  assert(result >= expLower, 'lower bound assertion')
  assert(result <= expUpper, 'upper bound assertion')
  if (isInteger) {
    assert(Number.isSafeInteger(result), 'not an integer')
  } else {
    assert(!!(result % 1), 'not a float')
  }
}

describe('number/random', function () {
  it('no args', function () {
    assertRange(random(), 0, 1)
  })

  it('upper range float', function () {
    assertRange(random(1.2), 0, 1.2)
  })

  it('upper range int', function () {
    assertRange(random(2), 0, 2)
  })

  it('lower & upper range float', function () {
    assertRange(random(5, 12.2), 5, 12.2)
  })

  it('lower & upper range int', function () {
    assertRange(random(2, 10), 2, 10)
  })
})

describe('number/randomInt', function () {
  it('no args', function () {
    assertRange(randomInt(), 0, 1, true)
  })

  it('upper range', function () {
    assertRange(randomInt(5), 0, 5, true)
  })

  it('lower & upper range', function () {
    assertRange(randomInt(10, 50), 10, 50, true)
  })
})
