import assert from 'node:assert'
import { resolve } from './urlResolve.js'

describe('node/http/urlResolve', function () {
  // Copied from node's test/parallel/test-url.js
  const tests = [
    [undefined, 'foo', 'foo'],
    ['foo/bar', 'foo', 'foo/foo'],
    ['/foo/bar', '/fff', '/fff'],
    ['/foo/bar', '', '/foo/bar'],
    ['/foo/bar', '../fff', '/fff'],
    ['/foo/bar', 'fff', '/foo/fff'],
    ['/foo/', 'fff', '/foo/fff'],
    ['/foo/bar', '..', '/'],
    ['/foo/bar/baz', 'quux', '/foo/bar/quux'],
    ['/foo/bar/baz', 'quux/asdf', '/foo/bar/quux/asdf'],
    ['/foo/bar/baz', 'quux/baz', '/foo/bar/quux/baz'],
    ['/foo/bar/baz', '../quux/baz', '/foo/quux/baz'],
    ['/foo/bar/baz', '/bar', '/bar'],
    ['/foo/bar/baz/', 'quux', '/foo/bar/baz/quux'],
    ['/foo/bar/baz/', 'quux/baz', '/foo/bar/baz/quux/baz'],
    ['/foo/bar/baz', '../../../../../../../../quux/baz', '/quux/baz'],
    ['/foo/bar/baz', '../../../../../../../quux/baz', '/quux/baz'],
    ['/foo', '.', '/'],
    ['/foo', '..', '/'],
    ['/foo/', '.', '/foo/'],
    ['/foo/', '..', '/'],
    ['/foo/bar', '.', '/foo/'],
    ['/foo/bar', '..', '/'],
    ['/foo/bar/', '.', '/foo/bar/'],
    ['/foo/bar/', '..', '/foo/'],
    ['foo/bar', '../../../baz', '../../baz'],
    ['foo/bar/', '../../../baz', '../baz'],
    ['/foo/bar/baz', '/../etc/passwd', '/etc/passwd'],
  ]
  tests.forEach(([from, to, exp]) => {
    it(`${[to, from]} => ${exp}`, function () {
      assert.strictEqual(resolve(to, from), exp)
    })
  })
})
