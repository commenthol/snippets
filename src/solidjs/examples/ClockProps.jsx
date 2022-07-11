import { createSignal, onCleanup } from 'solid-js'

export const format = (val) => (100 + val).toString().substring(1)

export function ClockProps (props) {
  const [time, setTime] = createSignal(new Date())
  const interval = setInterval(() => setTime(new Date()), 1000)
  onCleanup(() => clearInterval(interval))

  return (
    <>
      {props.children(
        time().getHours(),
        time().getMinutes(),
        time().getSeconds()
      )}
    </>
  )
}
