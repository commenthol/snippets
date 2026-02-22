import assert from 'assert'
import { Writable } from 'stream'
import { ResponseJsonStream } from './responseJsonStream.js'

describe('ResponseJsonStream', () => {
  let mockRes
  let chunks

  beforeEach(() => {
    chunks = []
    mockRes = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk.toString())
        callback()
      },
    })
    // @ts-expect-error
    mockRes.setHeader = () => {}
  })

  describe('initialization', () => {
    it('should initialize with opening bracket', () => {
      new ResponseJsonStream(mockRes)
      assert.strictEqual(chunks[0], '[')
    })

    it('should set correct content type header', () => {
      const headers = {}
      mockRes.setHeader = (key, value) => {
        headers[key] = value
      }
      new ResponseJsonStream(mockRes)
      assert.strictEqual(headers['Content-Type'], 'application/json')
      assert.strictEqual(headers['Transfer-Encoding'], 'chunked')
    })
  })

  describe('simple array stream', () => {
    it('should write simple JSON objects', () => {
      const stream = new ResponseJsonStream(mockRes)
      stream.write({ id: 1, name: 'Alice' })
      stream.write({ id: 2, name: 'Bob' })
      stream.end()

      const result = chunks.join('')
      assert.strictEqual(
        result,
        '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]'
      )
    })

    it('should handle first write without comma separator', () => {
      const stream = new ResponseJsonStream(mockRes)
      stream.write({ id: 1 })
      stream.end()

      const result = chunks.join('')
      assert(result === '[{"id":1}]')
    })

    it('should handle multiple writes with comma separators', () => {
      const stream = new ResponseJsonStream(mockRes)
      stream.write({ id: 1 })
      stream.write({ id: 2 })
      stream.write({ id: 3 })
      stream.end()

      const result = chunks.join('')
      assert(result === '[{"id":1},{"id":2},{"id":3}]')
    })
  })

  describe('object with array key', () => {
    it('should auto-detect array key', () => {
      const obj = {
        meta: { total: 2 },
        items: [],
      }
      new ResponseJsonStream(mockRes, { obj })
      assert.strictEqual(chunks[0], '{"meta":{"total":2},"items":[')
    })

    it('should use specified arrayKey', () => {
      const obj = {
        total: 2,
        data: [{ id: 1 }, { id: 2 }],
      }
      const stream = new ResponseJsonStream(mockRes, { obj, arrayKey: 'data' })
      stream.end()
      const result = chunks.join('')
      assert.strictEqual(result, '{"total":2,"data":[{"id":1},{"id":2}]}')
    })

    it('should allow additional writes after initial array items', () => {
      const obj = {
        meta: { total: 3 },
        items: [{ id: 1 }],
      }
      const stream = new ResponseJsonStream(mockRes, { obj })
      stream.write({ id: 2 })
      stream.write({ id: 3 })
      stream.end()

      const result = chunks.join('')
      assert.strictEqual(
        result,
        '{"meta":{"total":3},"items":[{"id":1},{"id":2},{"id":3}]}'
      )
    })
  })

  describe('error handling', () => {
    it('should throw error if no array key found', () => {
      const obj = { key1: 'value1', key2: 'value2' }
      assert.throws(
        () => new ResponseJsonStream(mockRes, { obj }),
        /No array key found in object/
      )
    })
  })
})
