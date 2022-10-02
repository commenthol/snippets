
/**
 * deep clone an object
 * won't clone object properties with enumerable descriptor set to false
 * won't clone functions
 * @param {any} obj
 * @returns {any}
 */
export const deepClone = (obj) => {
  const type = Object.prototype.toString.call(obj).slice(8)
  switch (type) {
    case 'Object]': {
      const clone = {}
      for (const key of Object.keys(obj)) {
        clone[key] = deepClone(obj[key])
      }
      return clone
    }
    case 'Array]': {
      const clone = []
      for (let i = 0; i < obj.length; i++) {
        clone[i] = deepClone(obj[i])
      }
      return clone
    }
    case 'Date]':
      return new Date(obj)
    case 'RegExp]':
      return new RegExp(obj.source, obj.flags)
    case 'Map]':
      return new Map(JSON.parse(JSON.stringify([...obj])))
    case 'Set]':
      return new Set(JSON.parse(JSON.stringify([...obj])))
    case 'Int8Array]':
      return new Int8Array(obj)
    case 'Uint8Array]':
      return obj instanceof Buffer // only on node
        ? Buffer.from(obj)
        : new Uint8Array(obj)
    case 'Uint8ClampedArray]':
      return new Uint8ClampedArray(obj)
    case 'Int16Array]':
      return new Int16Array(obj)
    case 'Uint16Array]':
      return new Uint16Array(obj)
    case 'Int32Array]':
      return new Int32Array(obj)
    case 'Uint32Array]':
      return new Uint32Array(obj)
    case 'Float32Array]':
      return new Float32Array(obj)
    case 'Float64Array]':
      return new Float64Array(obj)
    default:
      return obj
  }
}
