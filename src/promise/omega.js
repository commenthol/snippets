/**
 * replace try/catch boilerplaite with go like return values
 * @see https://gobyexample.com/errors
 * @example
 * const fn = async (x) => Promise.resolve(x + 4)
 * const [err, result] = await omega(fn)(6)
 * //> err == null, result == 10
 */
export const omega = fn => async (...args) => {
  try {
    const result = await fn(...args)
    return [null, result]
  } catch (err) {
    return [err]
  }
}

export default omega
