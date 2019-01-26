import assert from 'assert'
import os from 'os'
import fs from 'fs'
import { download } from '../..'// "/src/node"

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
})
