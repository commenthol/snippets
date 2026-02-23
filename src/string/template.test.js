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
    assert.strictEqual(r, ';; Alice - #MISSING{lastname}# ;;')
  })

  it('shall return #MISSING{<prop>}# string on missing obj props', () => {
    const t = template(';; ${firstname} - ${ lastname  } ;;')
    const r = t()
    assert.strictEqual(r, ';; #MISSING{firstname}# - #MISSING{lastname}# ;;')
  })

  it('shall return empty string if no templated prop is found', () => {
    const t = template(';; ${firstname} - ${ lastname  } ;;', { missing: '' })
    const r = t({ ok: true })
    assert.strictEqual(r, ';;  -  ;;')
  })

  it('shall use custom placeholder regex', () => {
    const t = template(';; {{firstname}} - {{lastname}} ;;', {
      placeholder: /\{\{([^}]+)\}\}/,
    })
    const r = t({ firstname: 'Alice', lastname: 'Anders' })
    assert.strictEqual(r, ';; Alice - Anders ;;')
  })

  it('shall not throw on missing template', () => {
    template()()
  })
})
