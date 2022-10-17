const NO_URL = 'null:'

/**
 * replaces deprecated url.parse() with new URL()
 * @param {string} url
 * @returns {string}
 */
export function parse (url) {
  const {
    href,
    origin,
    protocol,
    username,
    password,
    host,
    hostname,
    port,
    pathname,
    search,
    hash
  } = new URL(url, NO_URL + '/')
  const auth = username ? `${username}:${password}` : null
  const query = search.slice(1)
  const path = pathname + search
  const slashes = /^\S+[/]{2}/.test(origin) || null
  return {
    slashes,
    auth,
    href: href.indexOf(NO_URL) === 0 ? href.slice(5) : href,
    protocol: protocol === NO_URL ? null : protocol,
    host: host || null,
    hostname: hostname || null,
    port: port || null,
    query,
    path,
    pathname,
    search,
    hash
  }
}
