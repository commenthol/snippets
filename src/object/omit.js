/**
 * omit `object` properties `props`
 */
export const omit = (object, props = []) =>
  Object.keys(object)
    .filter(p => !~props.indexOf(p))
    .reduce((o, p) => {
      p in object && (o[p] = object[p])
      return o
    }, {})
