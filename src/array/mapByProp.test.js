import assert from 'node:assert'
import { mapByProp } from './index.js'

describe('array/mapByProp', () => {
  it('should map by id', () => {
    assert.deepStrictEqual(
      mapByProp(
        [
          { id: '1', a: 1 },
          { id: '3', c: 1 },
          { id: '2', b: 1 },
        ],
        'id'
      ),
      {
        1: { id: '1', a: 1 },
        3: { id: '3', c: 1 },
        2: { id: '2', b: 1 },
      }
    )
  })
})
