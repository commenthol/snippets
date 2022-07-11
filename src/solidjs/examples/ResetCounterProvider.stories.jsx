import { ResetCounterProvider, ResetCounter } from './ResetCounterProvider.jsx'

export const storyResetCounterProvider = {
  title: 'ResetCounter',
  component: () => (
    <ResetCounterProvider>
      <p>A common counter</p>
      <div>
        <ResetCounter />
      </div>
      <ResetCounter />
      <ResetCounterProvider initial={5}>
        <p>A common counter</p>
        <ResetCounter />
      </ResetCounterProvider>
    </ResetCounterProvider>
  )
}
