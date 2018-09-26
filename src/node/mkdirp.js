import {promisify} from 'util'
import fs from 'fs'
import path from 'path'

export async function mkdirp (dir) {
  const _dirs = path.resolve(dir).split(path.sep)
  let _dir = ''
  while (_dirs.length) {
    _dir += _dirs.shift() + '/'
    try {
      await promisify(fs.stat)(_dir)
    } catch (e) {
      await promisify(fs.mkdir)(_dir)
    }
  }
}
