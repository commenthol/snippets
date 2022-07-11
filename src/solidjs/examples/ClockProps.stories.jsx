import { ClockProps, format } from './ClockProps.jsx'

// disadvantage with this code reuse method is that the <span> gets re-rendered each second
export const storyClockProps = {
  title: 'ClockProps',
  component: () => (
    <ClockProps>
      {(hour, minute, second) => (
        <span style={{ color: 'magenta', 'font-weight': 'bold' }}>
          {format(hour)}:{format(minute)}:{format(second)}
        </span>
      )}
    </ClockProps>
  )
}
