export const PROTO = 'local://local'

/**
 * creates a URL representation which can deal with local url paths which do not
 * contain a hostname or protocol
 */
export class LocalURL extends URL {
  /**
   * @param {string|URL} uri
   */
  constructor(uri = '') {
    super(uri, PROTO)
  }

  /**
   * @returns {string}
   */
  toString() {
    const u = super.toString()
    if (u.startsWith(PROTO)) {
      return u.slice(PROTO.length)
    }
    return u
  }

  /**
   * @returns {boolean}
   */
  isLocal() {
    return this.href.startsWith(PROTO)
  }

  /**
   * set search params from object
   * @param {Record<string,any>|{}} [obj]
   * @returns {this}
   */
  setSearchParams(obj = {}) {
    this.search = ''
    for (const [name, value] of Object.entries(obj)) {
      if (value === undefined || value === '') continue
      this.searchParams.set(name, '' + value)
    }
    return this
  }
}
