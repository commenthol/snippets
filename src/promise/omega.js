/**
 * replace try/catch boilerplaite with go like return values
 * @see https://gobyexample.com/errors
 */
export const omega = async (fn, ...args) => {
  try {
    const result = await fn(...args)
    return [null, result]
  } catch (err) {
    return [err]
  }
}

export default omega
