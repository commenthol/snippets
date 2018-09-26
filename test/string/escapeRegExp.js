import assert from 'assert'
import {escapeRegExp} from '../../src/string'

describe('string/escapeRegExp', () => {
  it('should escape string', () => {
    assert.equal(
      escapeRegExp('\\+(]$*{^.|.^}*$[)+//'),
      '\\\\\\+\\(\\]\\$\\*\\{\\^\\.\\|\\.\\^\\}\\*\\$\\[\\)\\+//'
    )
  })
})
