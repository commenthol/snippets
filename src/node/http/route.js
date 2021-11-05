import { METHODS } from 'http'
import connect from './connect.js'

// istanbul ignore next
export function Route () {
  this._init()
}

Route.prototype = {
  _init () {
    this.methods = {}
  },

  method (method, ...handlers) {
    method = method.toUpperCase()
    if (this.methods[method]) throw new Error(`Method '${method}' is already defined`)
    this.methods[method] = handlers.length === 1
      ? handlers[0]
      : connect(...handlers)
    return this
  },

  handle (req, res, next) {
    const { method } = req
    const handler = this.methods[method]
    if (!handler) {
      next()
    } else {
      handler(req, res, next)
    }
  }
}

METHODS.forEach(method => {
  Route.prototype[method.toLowerCase()] = function (...handlers) {
    return this.method(method, ...handlers)
  }
})

export function route () {
  const route = function (req, res, next) {
    return route.handle(req, res, next)
  }
  Object.setPrototypeOf(route, Route.prototype)
  Route.prototype._init.call(route)
  return route
}
