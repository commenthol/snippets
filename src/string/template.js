/**
 * template function to use template literals on strings e.g. from JSON data
 * only placeholder replacement from object props is available.
 *
 * @param {string} [str=''] - template string
 * @param {object} [options] - options
 * @param {RegExp} [options.placeholder=/\${\s*([^}]+)\s*}/] - regular expression for placeholder
 * @param {string} [options.missing='#MISSING#'] - placeholder for missing props
 * @return {function} compiled template
 * @example
 * const compiled = template(';; ${firstname} - ${lastname} ;;')
 * const r = compiled({ firstname: 'Alice', lastname: 'Anders' })
 * > r = ';; Alice - Anders ;;'
 */
export const template = (str = '', options) => {
  const prop = []
  const tmpl = []
  const { placeholder = /\${\s*([^}]+)\s*}/, missing = '#MISSING{}#' } =
    options || {}

  while (str.length) {
    const m = placeholder.exec(str)
    if (m) {
      const pre = str.substring(0, m.index)
      str = str.slice(m.index + m[0].length)
      tmpl.push(pre)
      prop.push(m[1].trim())
    } else {
      tmpl.push(str)
      str = ''
      prop.push()
    }
  }

  return (obj = {}) => {
    let str = ''
    for (let i = 0; i < tmpl.length; i++) {
      str += tmpl[i]
      let p = prop[i]
      if (p) {
        str += obj[p] || missing?.replace('{}', `{${p}}`) || ''
      }
    }
    return str
  }
}
