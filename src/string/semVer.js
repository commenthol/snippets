const RE = /^([~^]?)(\d+)(?:\.(\d+|x)(?:\.(\d+|x)[._-]?(.*|)|)|)$/

/**
 * @typedef {object} Semver
 * @property {'^'|'~'|''} range
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {string} pre
 */

/**
 * @param {string|undefined|Semver} version
 * @returns {Semver}
 */
export function semVer (version = '') {
  if (typeof version === 'object') {
    const { range = '', major = 0, minor = 0, patch = 0, pre = '' } = version || {}
    return { range, major, minor, patch, pre }
  }
  const [m, _range, _major, _minor = 0, _patch = 0, pre = ''] = RE.exec(version) || []

  if (!m) return

  const range = _minor === 'x'
    ? '^'
    : _patch === 'x'
      ? '~'
      : _range
  const major = Number(_major)
  const minor = _minor === 'x' ? 0 : Number(_minor)
  const patch = _patch === 'x' ? 0 : Number(_patch)

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

/**
 * @param {string|undefined|Semver} a
 * @param {string|undefined|Semver} b
 * @returns {number} -1 if a < b; 0 if a == b; 1 if a > b
 */
export function compareSemVer (a, b) {
  const _a = semVer(a)
  const _b = semVer(b)
  const sameMajor = _a.major === _b.major
  const sameMinor = _a.minor === _b.minor
  const samePatch = _a.patch === _b.patch

  if (sameMajor) {
    if (sameMinor) {
      if (samePatch) {
        return (_a.pre || '').localeCompare(_b.pre || '')
      }
      return cap(_a.patch - _b.patch)
    }
    return cap(_a.minor - _b.minor)
  }
  return cap(_a.major - _b.major)
}

const cap = (num) => num < 0 ? -1 : num > 0 ? 1 : 0
