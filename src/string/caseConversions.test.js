import assert from 'assert'
import {
  capitalizeFirstLetter,
  camelToSnakeCase,
  snakeToCamelCase,
  camelToKebabCase,
  kebabToCamelCase,
} from './index.js'

describe('string/caseConversions', () => {
  it('capitalize first letter', () => {
    assert.strictEqual(capitalizeFirstLetter('lowercase'), 'Lowercase')
  })

  it('should convert lowerCamelCase to snake case', () => {
    assert.strictEqual(camelToSnakeCase('lowerCamelCase'), 'lower_camel_case')
  })

  it('should convert lowerCamelCase to snake case', () => {
    assert.strictEqual(
      camelToSnakeCase('IAmWritingXMLAndHTML'),
      'i_am_writing_x_m_l_and_h_t_m_l'
    )
  })

  it('should convert UpperCamelCase to snake case', () => {
    assert.strictEqual(camelToSnakeCase('UpperCamelCase'), 'upper_camel_case')
  })

  it('should convert from snake case', () => {
    assert.strictEqual(snakeToCamelCase('lower_camel_case'), 'lowerCamelCase')
  })

  it('should convert lowerCamelCase to kamel case', () => {
    assert.strictEqual(camelToKebabCase('lowerCamelCase'), 'lower-camel-case')
  })

  it('should convert from kebab case', () => {
    assert.strictEqual(kebabToCamelCase('lower-camel-case'), 'lowerCamelCase')
  })

  it('should convert from falsy kebab case', () => {
    assert.strictEqual(kebabToCamelCase('lower-CaMel-case'), 'lowerCamelCase')
  })
})
