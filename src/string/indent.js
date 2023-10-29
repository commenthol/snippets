/**
 * Indent text with spaces
 *
 * @param {string} str
 * @param {{
 *  spaces?: number
 *  first?: boolean
 * }} [param1]
 * @returns {string}
 */
export function indent (str = '', { spaces = 4, first = true } = {}) {
  const indent = new Array(spaces).fill(' ').join('')
  return str
    .split(/[\r\n]/)
    .map((line, i) => (!first && i === 0 ? '' : indent) + line)
    .join('\n')
}
