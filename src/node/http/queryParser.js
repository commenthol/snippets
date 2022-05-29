/**
 * connect middleware which adds `req.query` as object to Request
 * `req.pathname` contains path without search parameters
 * @param {object} req Request
 * @param {object} res Response
 * @param {Function} next
 */
export function queryParser (req, res, next) {
  const { pathname, searchParams } = new URL(req.url, new URL('xx://xx'))
  req.pathname = pathname
  req.query = Object.fromEntries(searchParams)
  next()
}
