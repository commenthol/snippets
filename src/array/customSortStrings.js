/**
 * generate the alphabet to sort with
 * @param {Function} [sort]
 * @returns {string[]}
 */
export const generateAlphabet = (sort) => {
  const alphabet = []
  // 0x0020 .. 0x007f latin
  // 0x00a0 .. 0x00ff latin 1 supplement
  // 0x0100 .. 0x017f latin extended-a
  // 0x0180 .. 0x024f latin extended-b
  //
  for (let i = 0x0020; i < 0x024f; i++) {
    if (i > 0x0079 && i < 0x00a0) continue // exclude some chars
    alphabet.push(String.fromCharCode(i))
  }
  return alphabet.sort(sort)
}

/// alphabet sorted by locale
const alphabet = generateAlphabet((a, b) => a.localeCompare(b))
/// alphabet sorted by char-code
// const alphabet = generateAlphabet()
/// custom alphabet - number come after ascii chars
// const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&\'()*+,-./'.split('')

/**
 * custom sorter for list of strings
 * @param {string[]} arr
 * @param {string[]} sortBy
 * @param {object} [param2]
 * @param {boolean} [param2.desc=false]
 * @param {boolean} [param2.custom=false]
 * @returns {string[]}
 */
export function customSortStrings (arr, sortBy = [], { desc = false, custom = false } = {}) {
  const order = [...sortBy]
  if (!custom) {
    alphabet.forEach(char => {
      if (!order.includes(char)) order.push(char)
    })
  }

  const getIndex = (str) => {
    let found
    for (const i in order) {
      const part = order[i]
      if (!found && str.indexOf(part) === 0) {
        return i
      }
    }
    return order.length
  }

  const sorter = (a, b) => {
    let ai
    let bi
    for (;;) {
      ai = getIndex(a)
      bi = getIndex(b)
      if (ai !== bi) {
        break
      }
      a = a.substring(order[ai]?.length || 1)
      b = b.substring(order[bi]?.length || 1)
      if (!a || !b) {
        return desc ? -1 : 1
      }
    }
    return desc ? bi - ai : ai - bi
  }

  return arr.sort(sorter)
}
