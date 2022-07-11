import { List } from './List.jsx'

export const storyList = {
  title: 'List',
  component: () => <List each={['one', 'two', 'three']} />
}
