import { Dynamic } from 'solid-js/web'
import { createSignal, onCleanup, splitProps } from 'solid-js'

const format = (val) => (100 + val).toString().substring(1)

// higher-order component
function withClock (c) {
  const [time, setTime] = createSignal(new Date())
  const interval = setInterval(() => setTime(new Date()), 1000)
  onCleanup(() => clearInterval(interval))

  return function Hoc (props) {
    return (
      <Dynamic
        component={c}
        hour={time().getHours()}
        minute={time().getMinutes()}
        second={time().getSeconds()}
        {...props}
      />
    )
  }
}

function Clock (props) {
  const [time, others] = splitProps(props, ['hour', 'minute', 'second'])
  return (
    <div {...others}>
      {format(time.hour)}:{format(time.minute)}:{format(time.second)}
    </div>
  )
}

export function ClockHoc (props) {
  return withClock(Clock)(props)
}
