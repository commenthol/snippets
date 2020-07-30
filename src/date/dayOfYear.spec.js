import assert from 'assert'
import { dayOfYear } from '.'

describe('date/dayOfYear', () => {
  it('should return a number', () => {
    assert.strictEqual(typeof dayOfYear(), 'number')
  })
  it('should return 1 on Jan 1st 2018', () => {
    assert.strictEqual(dayOfYear(new Date(2018, 0, 1)), 1)
  })
  it('should return 365 on Dec 31st in non leap year 2017', () => {
    assert.strictEqual(dayOfYear(new Date(2017, 11, 31, 23, 59)), 365)
  })
  it('should return 366 on Dec 31st in leap year 2016', () => {
    assert.strictEqual(dayOfYear(new Date(2016, 11, 31, 23, 59)), 366)
  })
})
