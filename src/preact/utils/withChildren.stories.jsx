import { useState } from 'preact/hooks'
import { withChildren } from "./withChildren"

function Store (props) {
  const { children, initialCount = 0 } = props
  const [count, setCount] = useState(initialCount)
  const handleIncrement = () => setCount(count + 1)
  const handleDecrement = () => setCount(count - 1)

  return withChildren(children, {
    count, 
    handleIncrement,
    handleDecrement
  })
}

function Counter (props) {
  const { count, handleIncrement, handleDecrement } = props
  return (
    <>
      <button onClick={handleDecrement}> - </button>
      {count}
      <button onClick={handleIncrement}> + </button>
    </>
  )
}

function TestWithChildren () {
  return (
    <>
      <Store>
        <h2>withChildren</h2>
        <Counter />
        &nbsp;
        <Counter />
      </Store>
      <p>
        Pass properties to all children components.
      </p>
    </>
  )
}

export const storyWithChildren = {
  titel: 'withChildren',
  component: TestWithChildren
}