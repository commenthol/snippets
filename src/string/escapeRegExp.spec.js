import assert from 'assert'
import { escapeRegExp } from '.'

describe('string/escapeRegExp', () => {
  it('should escape string', () => {
    assert.strictEqual(
      escapeRegExp('\\+(]$*{^.|.^}*$[)+//'),
      '\\\\\\+\\(\\]\\$\\*\\{\\^\\.\\|\\.\\^\\}\\*\\$\\[\\)\\+//'
    )
  })
})
