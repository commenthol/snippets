import { isAsyncFunction } from 'util/types'
import EventEmitter from 'events'

/** @typedef {import('node:child_process').ChildProcess} ChildProcess */

const promise = (ms = 100) => {
  const p = {}
  p.promise = new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      reject(new Error('timeout'))
    }, ms)
    p.resolve = (res) => {
      clearTimeout(timerId)
      resolve(res)
    }
    p.reject = (err) => {
      clearTimeout(timerId)
      reject(err)
    }
  })
  return p
}

export class IpcClient {
  /**
   * @param {ChildProcess} subprocess
   * @param {any} clss a class definition
   */
  constructor(subprocess, clss) {
    this._ids = new Map()
    this._count = 0
    this._subprocess = subprocess
    this._subprocess.on('message', ({ id, res, err }) => {
      const p = this._ids.get(id)
      if (!p) return
      if (err) {
        p.reject(new Error(err))
      } else {
        p.resolve(res)
      }
    })

    const methods = Object.getOwnPropertyNames(clss.prototype).filter(
      (prop) => prop !== 'constructor' && isAsyncFunction(clss.prototype[prop])
    )
    for (const method of methods) {
      if (this[method]) {
        throw new Error(`method "${method}" already exists`)
      }
      this[method] = (...args) => this._send(method, args)
    }
  }

  /**
   * @private
   * @returns {number}
   */
  _getId() {
    this._count = (this._count + 1) % Number.MAX_SAFE_INTEGER
    return this._count
  }

  /**
   * @private
   * @param {string} method
   * @param {any[]} args
   * @returns
   */
  _send(method, args) {
    const id = this._getId()
    const p = promise()
    if (!this._subprocess.send) {
      // TODO: IPC connection is not yet established
    }
    this._subprocess.send({ id, method, args }, (err) => {
      if (err) p.reject(err)
    })
    this._ids.set(id, p)
    return p.promise.finally(() => this._ids.delete(id))
  }

  /**
   * close the IPC connection
   * @returns {boolean}
   */
  close() {
    return this._subprocess.send({ command: 'disconnect' })
  }
}

export class IpcServer extends EventEmitter {
  /**
   * @param {ChildProcess} subprocess
   * @param {object} instance a class instance; must be the same as used by the IpcClient
   */
  constructor(subprocess, instance) {
    super()

    subprocess.on('message', async (msg) => {
      // console.log(msg)
      const { id, method, args = [], command } = msg
      if (command && subprocess[command]) {
        this.emit('command', command)
        subprocess[command](...args)
        return
      }
      if (!id || !method) {
        return
      }
      try {
        const res = await instance[method](...args)
        subprocess.send({ id, res })
      } catch (err) {
        subprocess.send({ id, err: err.message })
      }
    })

    subprocess.on('error', (err) => {
      this.emit('error', err)
    })
    subprocess.on('exit', (code) => {
      this.emit('exit', code)
    })
  }
}
