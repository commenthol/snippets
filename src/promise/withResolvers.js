/**
 * @returns {{
 *  promise: Promise<any>
 *  resolve: (value: any) => void
 *  reject: (reason?: any) => void
 * }}
 */
export const withResolvers = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { resolve, reject, promise }
}
