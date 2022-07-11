import { Show, createSignal } from 'solid-js'

export function ShowToggle () {
  const [isOn, setIsOn] = createSignal(false)
  const toggle = () => setIsOn(!isOn())

  return (
    <Show
      when={isOn()}
      fallback={<button onClick={toggle}>off</button>}
    >
      <button onClick={toggle}>ON</button>
    </Show>
  )
}
