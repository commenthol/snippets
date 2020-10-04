const PLACEHOLDER = /\${\s*([^}]+)\s*}/

/**
 * template function to use template literals on strings e.g. from JSON data
 * only placeholder replacement from object props is available.
 *
 * @param {string} [str=''] - template string
 * @param {RegExp} [placeholder=PLACEHOLDER] - regular expression for placeholder
 * @return {function} compiled template
 * @example
 * const compiled = template(';; ${firstname} - ${lastname} ;;')
 * const r = compiled({ firstname: 'Alice', lastname: 'Anders' })
 * > r = ';; Alice - Anders ;;'
 */
export const template = (str = '', placeholder = PLACEHOLDER) => {
  const prop = {}
  const tmpl = []

  while (str.length) {
    const m = placeholder.exec(str)
    if (m) {
      const pre = str.substring(0, m.index)
      str = str.substr(m.index + m[0].length)
      tmpl.push(pre)
      prop[m[1].trim()] = tmpl.length
      tmpl.push('')
    } else {
      tmpl.push(str)
      str = ''
    }
  }

  return (obj) => {
    let found = false
    if (!obj) return ''
    const str = Object.entries(obj).reduce((a, [key, val]) => {
      const pos = prop[key] || -1
      if (pos > -1) {
        found = true
        a[pos] = val
      }
      return a
    }, [...tmpl]).join('').trim()
    return found ? str : ''
  }
}
