/**
 * @author commenthol
 * @license UNLICENSE
 */

// for IE11 only as it cant iterate over HTMLElements
const { forEach } = Array.prototype

const insertAdjacentFn = (el) => typeof el === 'string'
  ? 'insertAdjacentHTML'
  : 'insertAdjacentElement'

/**
 * tiny jQuery like helper
 * @see http://youmightnotneedjquery.com/
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
 */
class JQ {
  /**
   * works on a single node
   */
  constructor (selector) {
    this.node = isElement(selector)
      ? selector
      : document.querySelector(selector)
  }
  create (tagName) {
    this.node = document.createElement(tagName)
    return this
  }
  empty () {
    this.node.innerHTML = ''
    return this
  }
  remove () {
    this.node.parentNode.removeChild(this.node)
  }
  parent () {
    return new JQ(this.node.parentNode)
  }
  append (el) {
    this.node.appendChild(isJQ(el))
    return this
  }
  prepend (el) {
    this.node.insertBefore(isJQ(el), this.node.firstChild)
    return this
  }
  before (el) {
    this.node[insertAdjacentFn(el)]('beforebegin', isJQ(el))
    return this
  }
  after (el) {
    this.node[insertAdjacentFn(el)]('afterend', isJQ(el))
    return this
  }
  text (str) {
    if (typeof str !== 'undefined') {
      this.node.textContent = str
      return this
    } else {
      return this.node.textContent
    }
  }
  html (str) {
    if (typeof str !== 'undefined') {
      this.node.innerHTML = str
      return this
    } else {
      return this.node.innerHTML
    }
  }
  children () {
    return this.node.children
  }
  find (selector) {
    return this.node.querySelectorAll(selector)
  }
  style (style) {
    if (typeof style === 'object') {
      Object.entries(style).forEach(([style, value]) => {
        this.node.style[style] = value
      })
      return this
    } else {
      return this.node.style
    }
  }
  attr (attr, value) {
    if (value !== undefined) {
      this.node.setAttribute(attr, value)
      return this
    } else if (typeof attr === 'object') {
      Object.entries(attr).forEach(([attr, value]) => {
        this.node.setAttribute(attr, value)
      })
      return this
    } else if (attr) { // get single attribute
      return this.node.getAttribute(attr)
    } else { // get all attributes
      return this.node.getAttributeNames().reduce((o, attr) => {
        o[attr] = this.node.getAttribute(attr)
        return o
      }, {})
    }
  }
  hasAttr (attr) {
    return this.node.hasAttribute(attr)
  }
  removeAttr (attr) {
    return this.node.removeAttribute(attr)
  }
  addClass (...classNames) {
    classNames.forEach(className => this.node.classList.add(className))
    return this
  }
  hasClass (className) {
    return this.node.classList.contains(className)
  }
  removeClass (className) {
    this.node.classList.remove(className)
    return this
  }
  on (eventName, eventHandler) {
    this.node.addEventListener(eventName, eventHandler)
    return this
  }
  off (eventName, eventHandler) {
    this.node.removeEventListener(eventName, eventHandler)
    return this
  }
}

class JQall {
  /**
   * works with multiple nodes
   */
  constructor (selector) {
    this.nodes = isElement(selector)
      ? [ selector ]
      : document.querySelectorAll(selector)
  }
  each (fn) {
    forEach.call(this.nodes, fn)
  }
}

export function jq (selector) {
  return new JQ(selector)
}

export const $ = jq

export function jqall (selector) {
  return new JQall(selector)
}

/**
 * @see https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
 */
export function isElement (obj) {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement
  } catch (e) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have (works on IE7)
    return (typeof obj === 'object') &&
      (obj.nodeType === 1) && (typeof obj.style === 'object') &&
      (typeof obj.ownerDocument === 'object')
  }
}

function isJQ (el) {
  return el instanceof JQ
    ? el.node
    : el
}

export const random = () => Math.random().toString(16).substr(2)

/**
 * copy value to clipboard
 */
export const copyToClipboard = value => {
  const el = $().create('textarea').text(value).attr({
    readonly: '',
    style: 'position:absolute;left:-9999px;'
  }).node
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}
