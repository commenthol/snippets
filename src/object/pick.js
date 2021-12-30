/**
 * pick `object` properties `props`
 * @param {object} obj
 * @param {string[]} props
 * @returns {object}
 */
export const pick = (obj, props = []) =>
  props.reduce((o, p) => {
    p in obj && (o[p] = obj[p])
    return o
  }, {})
