import { Highlight } from './Highlight'

export const storyHighlight = {
  title: 'Highlight',
  component: () => (
    <Highlight mark='te'>
      <div>Lorem te ipsum</div> test <span style={{ color: 'red' }}>test</span>
    </Highlight>
  )
}
