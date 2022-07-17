import React from 'react'
import ReactDOM from 'react-dom/client'

import Storybook from './Storybook.jsx'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Storybook stories={[
      <small>Components</small>,
      {
        title: 'Button',
        component: () => <button onClick={() => alert('Hi')}>Click me</button>
      },
      {
        title: 'Error',
        component: () => (
          <div>
            {(() => {throw new Error()})()}
          </div>
        )
      }
    ]}/>
  </React.StrictMode>
)
