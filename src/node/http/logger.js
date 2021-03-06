export const logger = (req, res, next) => {
  const time = Date.now()
  res.on('finish', () => {
    const { method, url, headers, body } = req
    const { statusCode } = res
    // eslint-disable-next-line no-console
    console.log('%s %s %s %s %j %s', method, url, statusCode, Date.now() - time, headers, JSON.stringify(body))
  })
  next()
}
