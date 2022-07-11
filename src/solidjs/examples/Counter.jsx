import { createSignal } from 'solid-js'

export function Counter (props) {
  const [count, setCount] = createSignal(props.count ?? 0)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c -1)

  return (
    <div>
      <button onClick={decrement}> - </button>
      <span>{count()}</span>
      <button onClick={increment}> + </button>
    </div>
  )
}

