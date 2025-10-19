import { isAsyncFunction } from 'util/types'
import crypto from 'crypto'
import EventEmitter from 'events'

/** @typedef {import('node:worker_threads').Worker} Worker */

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

export class ThreadClient {
  /**
   * @param {Worker} worker
   * @param {any} clss a class definition
   */
  constructor(worker, clss) {
    this._ids = new Map()
    this._worker = worker
    this._worker.on('message', ({ id, res, err }) => {
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
   * @param {string} method
   * @param {any[]} args
   * @returns
   */
  _send(method, args) {
    const id = crypto.randomUUID()
    const p = promise()
    this._worker.postMessage({ id, method, args }, (err) => {
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
    return this._worker.postMessage({ command: 'terminate' })
  }
}

export class ThreadServer extends EventEmitter {
  /**
   * @param {Worker} subprocess
   * @param {object} instance a class instance; must be the same as used by the IpcClient
   */
  constructor(worker, instance) {
    super()

    worker.on('message', async (msg) => {
      // console.log(msg)
      const { id, method, args = [], command } = msg
      if (command && worker[command]) {
        this.emit('command', command)
        worker[command](...args)
        return
      }
      if (!id || !method) {
        return
      }
      try {
        const res = await instance[method](...args)
        worker.postMessage({ id, res })
      } catch (err) {
        worker.postMessage({ id, err: err.message })
      }
    })

    worker.on('error', (err) => {
      this.emit('error', err)
    })
    worker.on('exit', (code) => {
      this.emit('exit', code)
    })
  }
}
