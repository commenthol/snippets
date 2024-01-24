import { Fetch } from './Fetch.js'
import { useFetcher } from './useFetcher.js'
import { useState } from 'preact/hooks'

class Fetcher extends Fetch {
  constructor () {
    super({ url: '/use-fetch' })
  }

  delayed () {
    return this._fetchQ('/delayed')
  }

  test (body) {
    return this._fetchP('/test', { body })
  }

  timeout () {
    return this._fetchQ('/timeout')
  }

  notFound () {
    return this._fetchQ('/not-found')
  }

  error (status = 500) {
    return this._fetchQ('/error', { query: { status } })
  }
}

export const storyUseFetcher = {
  title: 'useFetcher',
  component: () => {
    const fetcher = new Fetcher()

    const style = `
    pre { padding: 0.25em; }
    .data { background-color: #ccc; }
    .alert { background-color: #fcc; }
    `

    function Fetch ({ method, args = [] }) {
      const { data, error, isLoading } = useFetcher(fetcher[method].bind(fetcher), ...args)
      if (isLoading) {
        return <pre>{method}: ...loading</pre>
      }
      if (error) {
        console.log(error)
        return <pre className='alert'>{method}: {error?.message}</pre>
      }
      if (data) {
        return <pre className='data'>{method}: {JSON.stringify(data)}</pre>
      }
      return <pre>{method}: empty</pre>
    }

    function Input () {
      const [value, setValue] = useState('foo')
      const { data, error, isLoading, mutate } = useFetcher(fetcher.test.bind(fetcher), { value })
      const handleInput = (ev) => {
        const value = ev.target.value
        mutate({ value })
      }
      return (
        <>
          <input defaultValue={value} onInput={handleInput}></input>
          {isLoading
            ? <pre>...loading</pre>
            : error
              ? <pre className='alert'>{error?.message}</pre>
              : data
                ? <pre className='data'>{JSON.stringify(data?.body)}</pre>
                : <pre>empty</pre>
          }
        </>
      )
    }

    return (
      <section className='mdc-typography'>
        <style>{style}</style>
        <Fetch method='delayed' />
        <Fetch method='test' args={[{ foo: 'bar' }]} />
        <Fetch method='notFound' />
        <Fetch method='error' args={[501]} />
        <Input />
      </section>
    )
  }
}
