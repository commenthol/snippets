/**
 * connect middleware which adds `req.query` as object to Request
 * `req.pathname` contains path without search parameters
 * @param {object} req Request
 * @param {object} res Response
 * @param {Function} next
 */
export function queryParser(req, res, next) {
  const [path, search] = req.url.split('?')
  const searchParams = new URLSearchParams(search)
  req.path = path
  const query = (req.query = {})
  for (const [name, value] of searchParams.entries()) {
    if (query[name]) {
      Array.isArray(query[name])
        ? query[name].push(value)
        : (query[name] = [query[name], value])
    } else {
      query[name] = value
    }
  }
  next()
}
