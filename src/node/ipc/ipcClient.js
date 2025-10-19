import { IpcClient } from './IpcConnection.js'
import { Store } from './Store.js'

const client = new IpcClient(process, Store)
// console.log(client)

async function main() {
  console.log(await client.set('foo', 42))
  console.log(await client.get('foo'))
  console.log(await client.get('boom'))
}

main()
  .catch(console.error)
  .finally(() => client.close())
