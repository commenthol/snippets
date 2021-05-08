import assert from 'assert'
import {
  toUtf8,
  toUtf16,
  utf8ToUint8Array,
  uint8ArrayToUtf8,
  utf16ToUint8Array,
  uint8ArrayToUtf16
} from './index.js'

describe('string/utf8', () => {
  const strUtf16 = '∑⊛🤪😷👻'
  const arr = new Uint8Array([
    226, 136, 145, 226, 138,
    155, 240, 159, 164, 170,
    240, 159, 152, 183, 240,
    159, 145, 187
  ])

  it('should convert string to UTF8', () => {
    const strUtf8 = toUtf8(strUtf16)
    const utf8arr = utf8ToUint8Array(strUtf8)
    assert.deepStrictEqual(utf8arr, arr)
  })

  it('should convert back to string', () => {
    const strUtf8 = uint8ArrayToUtf8(arr)
    const str = toUtf16(strUtf8)
    assert.deepStrictEqual(str, strUtf16)
  })

  it('should convert string to UTF8 and back', () => {
    const strUtf8 = toUtf8(strUtf16)
    const str = toUtf16(strUtf8)
    assert.strictEqual(str, strUtf16)
  })

  it('utf16ToUint8Array', () => {
    const utf8arr = utf16ToUint8Array(strUtf16)
    assert.deepStrictEqual(utf8arr, arr)
  })

  it('uint8ArrayToUtf16', () => {
    const str = uint8ArrayToUtf16(arr)
    assert.deepStrictEqual(str, strUtf16)
  })
})
