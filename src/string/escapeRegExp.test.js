import assert from 'node:assert'
import { escapeRegExp } from './index.js'

describe('string/escapeRegExp', () => {
  it('should escape string', () => {
    assert.strictEqual(
      escapeRegExp('\\+(]$*{^.|.^}*$[)+//'),
      '\\\\\\+\\(\\]\\$\\*\\{\\^\\.\\|\\.\\^\\}\\*\\$\\[\\)\\+//'
    )
  })
})
