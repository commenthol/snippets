import assert from 'assert/strict'
import { rewrap } from './rewrap.js'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

describe('string/rewrap', function () {
  it('shall rewrap text', function () {
    const result = rewrap(lorem, { language: 'la', column: 78 })
    assert.deepEqual(result, [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ',
      'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ',
      'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ',
      'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ',
      'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non ',
      'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ])
  })
})
