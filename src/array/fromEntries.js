
// Native (pre ES2021)
export const fromEntriesNative = (arr) =>
  arr.reduce((acc, val) => {
    acc[val[0]] = val[1]
    return acc
  }, {})

// ES2021
export const fromEntries = (arr) => Object.fromEntries(arr)
