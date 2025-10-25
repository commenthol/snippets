/* eslint no-template-curly-in-string: off */
import assert from 'node:assert'
import { template } from './template.js'

describe('ui/utils/template', () => {
  it('shall compile template', () => {
    const t = template(';; ${firstname} - ${lastname} ;;')
    const r = t({ firstname: 'Alice', lastname: 'Anders' })
    assert.strictEqual(r, ';; Alice - Anders ;;')
  })

  it('shall compile template with missing prop', () => {
    const t = template(';; ${firstname} - ${ lastname  } ;;')
    const r = t({ firstname: 'Alice' })
    assert.strictEqual(r, ';; Alice -  ;;')
  })

  it('shall return empty string on missing obj', () => {
    const t = template(';; ${firstname} - ${ lastname  } ;;')
    const r = t()
    assert.strictEqual(r, '')
  })

  it('shall return empty string if no templated prop is found', () => {
    const t = template(';; ${firstname} - ${ lastname  } ;;')
    const r = t({ ok: true })
    assert.strictEqual(r, '')
  })

  it('shall not throw on missing template', () => {
    template()()
  })
})
