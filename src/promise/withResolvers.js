/**
 * @template T
 * @returns {{
 *  promise: Promise<T>
 *  resolve: (value: T) => void
 *  reject: (reason?: Error) => void
 * }}
 */
export const withResolvers = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  // @ts-expect-error
  return { resolve, reject, promise }
}
