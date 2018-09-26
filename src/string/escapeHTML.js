/**
 * escape HTML and prevent double escaping of '&'
 * @example
 * escapeHTML('<h1>"One" & 'Two' &amp; Works</h1>')
 * // &lt;h1&gt;&quot;One&quot; &amp; &#39;Two&#39; &amp; Works&lt;/h1&gt;
 */
export const escapeHTML = string => string
  .replace(/&amp;/g, '&')
  .replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]))
