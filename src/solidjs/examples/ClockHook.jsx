import { createSignal, onCleanup } from 'solid-js'

const format = (val) => (100 + val).toString().substring(1)

function useClock () {
  const [time, setTime] = createSignal(new Date())
  const interval = setInterval(() => setTime(new Date()), 1000)
  onCleanup(() => clearInterval(interval))

  return () => ({
    hour: time().getHours(),
    minute: time().getMinutes(),
    second: time().getSeconds()
  })
}

export function ClockHook () {
  const time = useClock()
  return (
    <div style={{ 'font-weight': 'bold' }}>
      {format(time().hour)}:{format(time().minute)}:{format(time().second)}
    </div>
  )
}
