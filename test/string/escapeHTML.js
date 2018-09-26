import assert from 'assert'
import {escapeHTML} from '../../src/string'

describe('string/escapeHTML', () => {
  it('should escape HTML', () => {
    assert.equal(
      escapeHTML('<h1><a href="/test?query=1&test=2">Does &amp; Works</a></h1>'),
      '&lt;h1&gt;&lt;a href=&quot;/test?query=1&amp;test=2&quot;&gt;Does &amp; Works&lt;/a&gt;&lt;/h1&gt;'
    )
  })
})
