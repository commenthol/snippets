import { useState } from 'preact/hooks'
import { classnames } from './classnames.js'
import styles from './classnames.stories.module.css'

const COLORS = ['red', 'cyan', 'magenta', 'green']

export const storyClassnames = {
  title: 'classnames',
  component: () => {
    const [count, setCount] = useState(0)
    const handleCount = ev => {
      setCount((count + 1) % COLORS.length)
    }

    const color = COLORS[count]

    return (
      <>
        <div className={classnames(styles.border, styles[color])}>
          {color}
        </div>

        <button onClick={handleCount}>next</button>
      </>
    )
  }
}
