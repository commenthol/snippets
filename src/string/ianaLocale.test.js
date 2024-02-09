import assert from 'assert'
import { ianaLocale } from './ianaLocale.js'

describe('string/ianaLocale', function () {
  it('undefined locale', function () {
    assert.deepStrictEqual(
      ianaLocale(), {
        locale: 'en',
        language: 'en',
        region: undefined
      })
  })

  it('different default locale', function () {
    assert.deepStrictEqual(
      ianaLocale(undefined, 'es'), {
        locale: 'es',
        language: 'es',
        region: undefined
      })
  })

  it('zh-Hant', function () {
    assert.deepStrictEqual(
      ianaLocale('zh-Hant'), {
        locale: 'zh',
        language: 'zh',
        region: undefined
      })
  })

  it('zh-cmn-Hans-CN', function () {
    assert.deepStrictEqual(
      ianaLocale('zh-cmn-Hans-CN'), {
        locale: 'zh-CN',
        language: 'zh',
        region: 'CN'
      })
  })

  it('hy-Latn-IT-arevela', function () {
    assert.deepStrictEqual(
      ianaLocale('hy-Latn-IT-arevela'), {
        locale: 'hy-IT',
        language: 'hy',
        region: 'IT'
      })
  })

  it('es-419', function () {
    assert.deepStrictEqual(
      ianaLocale('es-419'), {
        locale: 'es-419',
        language: 'es',
        region: '419'
      })
  })

  it('es-QO private region', function () {
    assert.deepStrictEqual(
      ianaLocale('es-QO'), {
        locale: 'es-QO',
        language: 'es',
        region: 'QO'
      })
  })

  it('sr-Qaaa-RS', function () {
    assert.deepStrictEqual(
      ianaLocale('sr-Qaaa-RS'), {
        locale: 'sr-RS',
        language: 'sr',
        region: 'RS'
      })
  })
})
