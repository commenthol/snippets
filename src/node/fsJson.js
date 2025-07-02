import fsp from 'fs/promises'

/**
 * @param {string|URL} filename
 * @returns {Promise<any>}
 */
export const readJson = async (filename) => {
  const content = await fsp.readFile(filename, 'utf-8')
  return JSON.parse(content)
}

/**
 * @param {string|URL} filename
 * @param {any} data
 */
export const writeJson = async (filename, data) => {
  const content = JSON.stringify(data, null, 2)
  await fsp.writeFile(filename, content, 'utf-8')
}
