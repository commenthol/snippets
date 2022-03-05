/**
 * stop event propagation
 * @param {Event} ev
 * @param {boolean} doPreventDefault call ev.preventDefault()
 * @returns {Event} ev
 */
export function stopPropagation (ev, doPreventDefault) {
  if (doPreventDefault) ev.preventDefault()
  ev.stopImmediatePropagation()
  ev.stopPropagation()
  return ev
}
