/**
 * escape HTML and prevent double escaping of '&'
 * @param {String} string - which requires escaping
 * @returns {String} escaped string
 * @example
 * escapeHTML('<h1>"One" & 'Two' &amp; Works</h1>')
 * // &lt;h1&gt;&quot;One&quot; &amp; &#39;Two&#39; &amp; Works&lt;/h1&gt;
 */
export const escapeHtml = string => (string || '')
  .replace(/&amp;/g, '&')
  .replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]))

/**
 * Escape all vars in a template literal
 * @param {*} literals
 * @param  {...any} vars
 * @returns {String}
 * @example
 * escapeHtmlLiteral('<h1>"One" & 'Two' &amp; Works</h1>')
 * // &lt;h1&gt;&quot;One&quot; &amp; &#39;Two&#39; &amp; Works&lt;/h1&gt;
 */
export const escapeHtmlLiteral = (literals, ...vars) => literals
  .map((literal, i) => literal + escapeHtml(vars[i]))
  .join('')
