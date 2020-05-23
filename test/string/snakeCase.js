import assert from 'assert'
import { toSnakeCase, fromSnakeCase } from '../../src/string'

describe('string/snakeCase', () => {
  it('should convert lowerCamelCase to snake case', () => {
    assert.strictEqual(toSnakeCase('lowerCamelCase'), 'lower_camel_case')
  })

  it('should convert UpperCamelCase to snake case', () => {
    assert.strictEqual(toSnakeCase('UpperCamelCase'), 'upper_camel_case')
  })

  it('should convert from snake case', () => {
    assert.strictEqual(fromSnakeCase('lower_camel_case'), 'lowerCamelCase')
  })
})
