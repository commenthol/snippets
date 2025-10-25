// @ts-ignore
export const nodeVersion = process.version
  .match(/(\d+)/g)
  .map((n) => parseInt(n))
