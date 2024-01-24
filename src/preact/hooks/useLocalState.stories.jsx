import { useLocalState, useMemoryState, useSessionState } from './useLocalState'

export const storyUseLocalState = {
  title: 'useLocalState',
  component: () => {
    const [countM, setCountM] = useMemoryState(0, 'count')
    const [countL, setCountL] = useLocalState(1, 'count')
    const [countS, setCountS] = useSessionState(2, 'count')

    return (
      <div>
        <p>useMemoryState</p>
        {countM.toString(16)}<span> </span>
        <button onClick={() => setCountM((countM + 1) % 16)}>Count up</button>

        <p>useLocalState</p>
        {countL.toString(16)}<span> </span>
        <button onClick={() => setCountL((countL + 1) % 16)}>Count up</button>

        <p>useSessionState</p>
        {countS.toString(16)}<span> </span>
        <button onClick={() => setCountS((countS + 2) % 16)}>Count up</button>
      </div>
    )
  }
}
