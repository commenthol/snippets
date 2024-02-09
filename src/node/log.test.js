import { logd, log } from './log.js'

describe('node/log', function () {
  it('log', function () {
    log.debug('debug')
    log.info('info')
    log.warn('warn')
    log.error('error')
  })
  it('logd', function () {
    logd.debug('debug')
    logd.info('info')
    logd.warn('warn')
    logd.error('error')
  })
})
