import { IpcClient } from './IpcConnection.js'
import { Store } from './Store.js'

// @ts-ignore
const client = new IpcClient(process, Store)
// console.log(client)

async function main() {
  // @ts-expect-error
  console.log(await client.set('foo', 42))
  // @ts-expect-error
  console.log(await client.get('foo'))
  // @ts-expect-error
  console.log(await client.get('boom'))
}

main()
  .catch(console.error)
  .finally(() => client.close())
