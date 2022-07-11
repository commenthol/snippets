import { createSignal, createContext, useContext } from 'solid-js'
import styles from './ResetCounterProvider.module.css'

const ResetCounterContext = createContext()

export function ResetCounterProvider (props) {
  const [count, setCount] = createSignal(props.initial ?? 0)
  const counter = [
    count,
    {
      increment () {
        setCount((c) => c + 1)
      },
      reset () {
        setCount(() => 0)
      }
    }
  ]

  return (
    <ResetCounterContext.Provider value={counter}>
      {props.children}
    </ResetCounterContext.Provider>
  )
}

export function useResetCounter () {
  return useContext(ResetCounterContext)
}

// import { useResetCount } from './ResetCounterProvider.jsx'

export function ResetCounter () {
  const [count, { increment, reset }] = useResetCounter()
  return (
    <div class={styles.resetCounter}>
      <span>{count()}</span>
      <button onClick={increment}> +  </button>
      <button onClick={reset}>reset</button>
    </div>
  )
}
