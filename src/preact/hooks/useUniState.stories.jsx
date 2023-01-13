import { useState } from 'preact/hooks'
import { useUniActions, useUniState } from './useUniState.js'

function Counter () {
  const [count, setCount] = useState(0)
  const handleIncrement = () => setCount(count + 1)

  return (
    <div style={{ padding: '0.5em 1em' }}>
      <h3>{count} - useState</h3>
      <button onClick={handleIncrement}>Count up</button>
    </div>
  )
}

function CounterUniState () {
  const [count, setCount] = useUniState('count', 0)
  const handleIncrement = () => setCount(count + 1)

  return (
    <div style={{ padding: '0.5em 1em' }}>
      <h3>{count} - useUniState</h3>
      <button onClick={handleIncrement}>Count up</button>
    </div>
  )
}

function CounterUniActions () {
  const actions = (count, setCount) => ({
    handleIncrement: () => setCount(count + 1)
  })
  const { count, handleIncrement } = useUniActions('count', 0, actions)

  return (
    <div style={{ padding: '0.5em 1em' }}>
      <h3>{count} - useUniActions</h3>
      <button onClick={handleIncrement}>Count up</button>
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
          ? <>
            <Counter />
            <CounterUniState />
            <CounterUniActions />
          </>
          : <h3>Counter hidden...</h3>
        }
      </div>
    )
  }
}
