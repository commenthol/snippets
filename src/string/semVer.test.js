import assert from 'node:assert'
import { semVer, semVerStringify, compareSemVer } from './semVer.js'

describe('string/semVer', function () {
  it('undefined', function () {
    assert.strictEqual(semVer(), undefined)
  })
  it('foobar', function () {
    assert.strictEqual(semVer('foobar'), undefined)
  })
  it('0.0.0', function () {
    assert.deepStrictEqual(semVer('0.0.0'), {
      range: '',
      major: 0,
      minor: 0,
      patch: 0,
      pre: '',
    })
  })
  it('^12.7.123', function () {
    assert.deepStrictEqual(semVer('^12.7.123'), {
      range: '^',
      major: 12,
      minor: 7,
      patch: 123,
      pre: '',
    })
  })
  it('12.7.x', function () {
    assert.deepStrictEqual(semVer('12.7.x'), {
      range: '~',
      major: 12,
      minor: 7,
      patch: 0,
      pre: '',
    })
  })
  it('012.x.x', function () {
    assert.deepStrictEqual(semVer('012.x.x'), {
      range: '^',
      major: 12,
      minor: 0,
      patch: 0,
      pre: '',
    })
  })
  it('~0.10.5-rc1', function () {
    assert.deepStrictEqual(semVer('~0.10.5-rc1'), {
      range: '~',
      major: 0,
      minor: 10,
      patch: 5,
      pre: 'rc1',
    })
  })
  it('1', function () {
    assert.deepStrictEqual(semVer('1'), {
      range: '',
      major: 1,
      minor: 0,
      patch: 0,
      pre: '',
    })
  })
  it('~2.x', function () {
    assert.deepStrictEqual(semVer('~2.x'), {
      range: '^',
      major: 2,
      minor: 0,
      patch: 0,
      pre: '',
    })
  })
  it('^5', function () {
    assert.deepStrictEqual(semVer('^5'), {
      range: '^',
      major: 5,
      minor: 0,
      patch: 0,
      pre: '',
    })
  })
})

describe('string/semVerStringify', function () {
  it('^12.10.5', function () {
    assert.strictEqual(
      semVerStringify({ range: '^', major: 12, minor: 10, patch: 5, pre: '' }),
      '^12.10.5'
    )
  })
  it('~0.10.5-rc1', function () {
    assert.strictEqual(
      semVerStringify({
        range: '~',
        major: 0,
        minor: 10,
        patch: 5,
        pre: 'rc1',
      }),
      '~0.10.5-rc1'
    )
  })
})

describe('string/compareSemVer', function () {
  it('1.0.0 < 2.0.0', function () {
    assert.strictEqual(compareSemVer('^1.0.0', '2.0.0'), -1)
  })
  it('2.0.0 > 1.0.0', function () {
    assert.strictEqual(
      compareSemVer({ major: 2, minor: 0, patch: 0 }, '~1.0.0'),
      1
    )
  })
  it('2.0.0 = 2.0.0', function () {
    assert.strictEqual(
      compareSemVer({ major: 2, minor: 0, patch: 0 }, '~2.0.0'),
      0
    )
  })
  it('1.1.0 < 1.2.0', function () {
    assert.strictEqual(compareSemVer('^1.1.0', '1.2.0'), -1)
  })
  it('1.2.0 > 1.0.0', function () {
    assert.strictEqual(compareSemVer('1.2.0', '1.0.0'), 1)
  })
  it('1.2.0 = 1.2.0', function () {
    assert.strictEqual(compareSemVer('1.2.0', '1.2.0'), 0)
  })
  it('3.1.1 < 3.1.2', function () {
    assert.strictEqual(compareSemVer('3.1.1', '3.1.2'), -1)
  })
  it('3.1.1 > 3.1.0', function () {
    assert.strictEqual(compareSemVer('3.1.1', '3.1.0'), 1)
  })
  it('3.3.3 = 3.3.3', function () {
    assert.strictEqual(compareSemVer('3.3.3', '3.3.3'), 0)
  })
  it('3.3.3-rc1 < 3.3.3-rc2', function () {
    assert.strictEqual(compareSemVer('3.3.3-rc1', '3.3.3-rc2'), -1)
  })
})
