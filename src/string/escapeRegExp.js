/**
 * Escape a string for using as regular expression
 * @example
 * escapeRegExp('($^|^$)')
 * //> '\\(\\$\\^\\|\\^\\$\\)'
 */
export const escapeRegExp = string => string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
