import assert from 'assert'
import { sortBy } from './index.js'

describe('array/sortBy', function () {
  it('sort array of objects by user', function () {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
    ]
    assert.deepStrictEqual(sortBy(users, 'user'), [
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ])
  })

  it('sort array of objects by user and age', function () {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
    ]
    assert.deepStrictEqual(sortBy(users, ['user', 'age']), [
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ])
  })
})
