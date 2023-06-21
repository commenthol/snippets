/**
 * calculate the offset to top from a given DOM element
 * @param {HTMLElement} $el
 * @param {number} [offset=0] apply an additional offset
 * @returns {number|undefined}
 */
export const elDistanceToTop = ($el, offset = 0) => $el
  ? window.pageYOffset + $el.getBoundingClientRect().top + offset
  : undefined
