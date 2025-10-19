/**
 * pick `object` properties `props`.
 * does not pick props with values being undefined.
 * @param {object} obj
 * @param {string[]} props
 * @returns {object}
 */
export const pick = (obj, props = []) =>
  props.reduce((o, p) => {
    p in obj && obj[p] !== undefined && (o[p] = obj[p])
    return o
  }, Object.create(null))
