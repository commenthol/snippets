import assert from 'assert'
import { escapeHtml, escapeHtmlLiteral } from './index.js'

describe('string/escapeHTML', () => {
  it('should escape HTML', () => {
    assert.strictEqual(
      escapeHtml(
        '<h1><a href="/test?query=1&test=2">Does &amp; Works</a></h1>'
      ),
      '&lt;h1&gt;&lt;a href=&quot;/test?query=1&amp;test=2&quot;&gt;Does &amp; Works&lt;/a&gt;&lt;/h1&gt;'
    )
  })

  it('should escape HTML template', () => {
    assert.strictEqual(
      escapeHtmlLiteral`<h1><a href="${'/<test?query=1&test=2'}">${'<script>Does & Works >'}${12} ${true}</a></h1>`,
      '<h1><a href="/&lt;test?query=1&amp;test=2">&lt;script&gt;Does &amp; Works &gt;12 true</a></h1>'
    )
  })
})
