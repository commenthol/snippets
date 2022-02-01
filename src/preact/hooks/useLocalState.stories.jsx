import { useLocalState  } from "./useLocalState"

export const storyUseLocalState = {
  titel: 'useLocalState',
  component: () => {
    const [count, setCount] = useLocalState(0, 'count')

    return (
      <div>
        {count.toString(16)}&nbsp;
        <button onClick={()=> setCount((count + 1) % 16)}>Count up</button>
      </div>
    )
  }
}
