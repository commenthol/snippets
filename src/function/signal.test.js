import assert from 'node:assert'
import { createSignal, createEffect, createMemo } from './signal.js'

describe('function/signal', function () {
  it('shall update signal', function () {
    const arr = []
    const [count, setCount] = createSignal(3)

    arr.push(count())
    setCount(5)
    arr.push(count())
    setCount(count() * 2)
    arr.push(count())
    assert.deepEqual(arr, [3, 5, 10])
  })

  it('with effect', function () {
    const arr = []
    // 1. Create Signal
    const [count, setCount] = createSignal(0)

    // 2. Create Reaction
    createEffect(() => arr.push(count()))
    // 3. Set count to 5
    setCount(5)
    // 4. Set count to 10
    setCount(10)

    assert.deepEqual(arr, [0, 5, 10])
  })

  it('conditional rendering', function () {
    const arr = []

    // 1. Create'
    const [firstName] = createSignal('John')
    const [lastName, setLastName] = createSignal('Smith')
    const [showFullName, setShowFullName] = createSignal(true)

    const displayName = createMemo(() => {
      if (!showFullName()) return firstName()
      return `${firstName()} ${lastName()}`
    })

    createEffect(() => arr.push(displayName()))

    // 2. Set showFullName: false
    setShowFullName(false)
    // 3. Change lastName
    setLastName('Legend')
    // 4. Set showFullName: true
    setShowFullName(true)

    assert.deepEqual(arr, ['John Smith', 'John', 'John Legend'])
  })

  it('nested effects pile up subscriptions', function () {
    const arr = []
    const [firstName, setFirstName] = createSignal('John')
    const [lastName, setLastName] = createSignal('Smith')

    createEffect(() => {
      // console.debug(`firstName=${firstName()}`)
      arr.push(firstName())

      // NOTE: creates a new subscription on every update
      createEffect(() => {
        // console.debug(`lastName=${lastName()}`)
        arr.push(lastName())
      })
    })

    setFirstName('Joe')
    setFirstName('Jack')
    setLastName('Legend')

    assert.equal(firstName(), 'Jack')
    assert.equal(lastName(), 'Legend')

    assert.deepEqual(arr, [
      'John',
      'Smith',
      'Joe',
      'Smith',
      'Jack',
      'Smith',
      'Legend',
      'Legend',
      'Legend',
    ])
  })
})
