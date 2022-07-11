import { Index } from 'solid-js'

export function List (props) {
  return (
    <ul>
      <Index each={props.each}>
        {(item, index) =>
          <li>{index()} {item()}</li>
      }
      </Index>
    </ul>
  )
}
