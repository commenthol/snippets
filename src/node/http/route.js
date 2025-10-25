// @ts-nocheck

import { METHODS } from 'node:http'
import connect from './connect.js'

/**
 * Routes by method
 */
export function Route() {
  // @ts-expect-error
  this._init()
}

Route.prototype = {
  _init() {
    this.methods = {}
  },

  method(method, ...handlers) {
    method = method.toUpperCase()
    // @ts-expect-error
    if (this.methods[method])
      throw new Error(`Method '${method}' is already defined`)
    // @ts-expect-error
    this.methods[method] =
      handlers.length === 1 ? handlers[0] : connect(...handlers)
    return this
  },

  handle(req, res, next) {
    const { method } = req
    // @ts-expect-error
    const handler = this.methods[method]
    if (!handler) {
      next()
    } else {
      handler(req, res, next)
    }
  },
}

METHODS.forEach((method) => {
  Route.prototype[method.toLowerCase()] = function (...handlers) {
    return this.method(method, ...handlers)
  }
})

/**
 * @returns {import('./connect-types.js').HandleFunction}
 */
export function route() {
  const route = function (req, res, next) {
    // @ts-expect-error
    return route.handle(req, res, next)
  }
  Object.setPrototypeOf(route, Route.prototype)
  Route.prototype._init.call(route)
  return route
}
