
import os from 'os'

const flatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? flatten(v) : v)))

/**
 * return list of local ip addresses
 * @return {Object[]} array of objects `{name, address}`
 */
export const localIps = () => flatten(
  Object.entries(os.networkInterfaces()).map(([name, addresses]) =>
    addresses.map(({ family, internal, address }) => {
      if (family === 'IPv4' && internal !== true) {
        return { name, address }
      }
    }).filter(Boolean)
  ).filter(Boolean)
)

// console.log(localIps()) // eslint-disable-line
