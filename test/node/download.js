import assert from 'assert'
import os from 'os'
import fs from 'fs'
import { download, downloadWithRedirects } from '../..'// "/src/node"

describe('node/download', () => {
  it('should download to file', () => {
    const target = `${os.tmpdir()}/nodejs-org.html`

    return download('https://nodejs.org/en/', target)
      .then(() => {
        const stat = fs.statSync(target)
        assert.ok(stat.isFile())
      })
      .catch(err => assert.ok(!err, 'should download target'))
  })

  it('should download to file using redirects and compression', () => {
    const target = `${os.tmpdir()}/nodejs-org.1.html`

    return downloadWithRedirects('http://nodejs.org/en/', target)
      .then(() => {
        const stat = fs.statSync(target)
        assert.ok(stat.isFile())
      })
      .catch(err => assert.ok(!err, 'should download target'))
  })
})
