/**
 * @param  {...any} args
 * @returns {string}
 */
export const classnames = (...args) => args.filter(Boolean).join(' ')
