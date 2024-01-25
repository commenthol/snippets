/**
 * omit `object` properties `props`
 * @param {object} obj
 * @param {string[]} props
 * @returns {object}
 */
export const omit = (obj, props = []) =>
  Object.keys(obj).reduce((o, p) => {
    !~props.indexOf(p) && p in obj && obj[p] !== undefined && (o[p] = obj[p])
    return o
  }, {})
