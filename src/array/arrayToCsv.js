/**
 * convert array to csv
 * @param {any[][]} arr 2dim array
 * @param {object} [param1]
 * @param {(string|number)[]} [param1.header] header row
 * @param {string} [param1.delimiter= ','] used delimiter
 * @returns {string} csv string
 */
export const arrayToCsv = (arr, { header, delimiter = ',' } = {}) =>
  (header && header.length ? [header, ...arr] : arr)
    .map(row => row
      .map(cell => `"${String(cell ?? '').replace(/"/g, '\\"')}"`)
      .join(delimiter)
    ).join('\n')

/**
 * convert csv to array
 * @param {string} str
 * @param {object} [param1]
 * @param {string} [param1.delimiter= ','] used delimiter
 * @returns {any[][]} 2dim array
 */
export const csvToArray = (str = '', { delimiter = ',' } = {}) => {
  const usesQuotes = str[0] === '"'
  const _str = str.replace(/\s+$/, '')
  const rowSplit = usesQuotes ? `"${delimiter}"` : delimiter
  return !usesQuotes
    ? _str.split(/[\r\n]/).map(row => row.split(rowSplit))
    : _str.substring(1).replace(/"$/, '').split(/"[\r\n]"/)
      .map(row => row.split(rowSplit).map(cell => cell.replace(/\\"/g, '"')))
}
