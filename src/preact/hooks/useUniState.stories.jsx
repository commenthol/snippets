import { useState } from 'preact/hooks'
import { useUniActions } from './useUniState.js'

const actions = (count, setCount) => ({
  increment: () => setCount(count + 1),
  decrement: () => setCount(count - 1)
})

function Counter () {
  const { count, increment } = useUniActions('count', 0, actions)

  return (
    <div style={{ padding: '0.5em 1em', border: '1px solid grey' }}>
      <h3>{count}</h3>
      <button onClick={increment}>Count up</button>
    </div>
  )
}

export const storyUseUniState = {
  title: 'useUniState',
  component: () => {
    const [show, setShow] = useState(true)

    return (
      <div>
        <div>
          <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
        </div>
        {show
          ? <Counter />
          : <h3>Counter hidden...</h3>
        }
      </div>
    )
  }
}
