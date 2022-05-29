
import os from 'os'

const flatten = arr => arr.flat(Infinity)

/**
 * return list of local ip addresses
 * @return {Object[]} array of objects `{name, address}`
 */
export const localIps = () => flatten(
  Object.entries(os.networkInterfaces()).map(([name, addresses]) =>
    // eslint-disable-next-line array-callback-return
    addresses.map(({ family, internal, address }) => {
      if ((family === 'IPv4' || family === 4) && internal !== true) {
        return { name, address }
      }
    }).filter(Boolean)
  ).filter(Boolean)
)

// console.log(localIps()) // eslint-disable-line
