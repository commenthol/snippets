/**
 * omit `object` properties `props`
 * @param {object} obj
 * @param {string[]} props
 * @returns {object}
 */
export const omit = (obj, props = []) =>
  Object.keys(obj)
    .filter(p => !~props.indexOf(p))
    .reduce((o, p) => {
      p in obj && (o[p] = obj[p])
      return o
    }, {})
