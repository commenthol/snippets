import assert from 'assert'
import { inspect } from 'util'
import { changeFunctionName } from './index.js'

describe('function/changeFunctionName', () => {
  it('shall change name', async () => {
    function foo() {}
    changeFunctionName(foo, 'bar')
    assert.strictEqual(foo.name, 'bar')
    assert.strictEqual(inspect(foo), '[Function: bar]')
  })

  it('shall change class name', async () => {
    class Foo {}
    changeFunctionName(Foo, 'Bar')
    assert.strictEqual(Foo.name, 'Bar')
    assert.strictEqual(inspect(Foo), '[class Bar]')
  })
})
