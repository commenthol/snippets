export class Store {
  constructor () {
    this.store = {}
  }

  async set (name, val) {
    this.store[name] = val
    return true
  }

  async get (name) {
    const val = this.store[name]
    return (val === undefined)
      ? Promise.reject(new Error(`value for "${name}" not found`))
      : val
  }
}
