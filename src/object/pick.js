/**
 * pick `object` properties `props`
 */
export const pick = (object, props = []) =>
  props.reduce((o, p) => {
    p in object && (o[p] = object[p])
    return o
  }, {})
