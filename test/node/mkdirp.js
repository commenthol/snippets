import fs from 'fs'
import os from 'os'
import path from 'path'
import assert from 'assert'
import { mkdirp } from '../../src/node'

describe('node/mkdirp', () => {
  const rand = () => Math.random().toString(16).substr(2)
  const dir = [ os.tmpdir(), 'mkdirp', rand(), rand() ].join(path.sep)

  it('should create new dir', () => {
    return mkdirp(dir)
      .then(() => {
        const stat = fs.statSync(dir)
        assert.ok(stat.isDirectory())
      })
      .catch(err => assert.ok(!err, 'should read dir'))
  })
})
