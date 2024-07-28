/**
 * @returns {{
 *  promise: Promise<any>
 *  resolve: (value: any) => void
 *  reject: (reason?: any) => void
 * }}
 */
export const withResolvers = () => {
  let resolve, reject
  // eslint-disable-next-line promise/param-names
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { resolve, reject, promise }
}
