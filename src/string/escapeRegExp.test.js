import assert from 'assert'
import { escapeRegExp } from './index.js'

describe('string/escapeRegExp', () => {
  it('should escape string', () => {
    assert.strictEqual(
      escapeRegExp('\\+(]$*{^.|.^}*$[)+//'),
      '\\\\\\+\\(\\]\\$\\*\\{\\^\\.\\|\\.\\^\\}\\*\\$\\[\\)\\+//'
    )
  })
})
