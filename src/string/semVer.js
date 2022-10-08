const RE = /^([~^]?)(\d+)(?:\.(\d+|x)(?:\.(\d+|x)(\D.*|)|)|)$/

/**
 * @typedef {object} Semver
 * @property {'^'|'~'|''} range
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {string} pre
 */

/**
 * @param {string|undefined} version
 * @returns {Semver}
 */
export function semVer (version = '') {
  const [m, _range, _major, _minor = 0, _patch = 0, _pre] = RE.exec(version) || []

  if (!m) return

  const range = _minor === 'x'
    ? '^'
    : _patch === 'x'
      ? '~'
      : _range
  const major = Number(_major)
  const minor = _minor === 'x' ? 0 : Number(_minor)
  const patch = _patch === 'x' ? 0 : Number(_patch)
  const pre = _pre ? _pre.slice(1) : ''

  return { range, major, minor, patch, pre }
}

/**
 * @param {Semver} semver
 * @returns {string}
 */
export function semVerStringify (semver) {
  const { range = '', major, minor = 0, patch = 0, pre = '' } = semver

  if (isNaN(major)) throw new TypeError('not semver')

  return [range, major, '.', minor, '.', patch, pre ? '-' + pre : ''].join('')
}
