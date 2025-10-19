/**
 * format a markdown table
 * @param {string[][]} table
 * @returns {string}
 */
export function mdTable(table) {
  const cellLen = []
  const orient = []
  let maxY = 0

  const y1x0 = table[1][0].trim()
  if (!/[-:]/.test(y1x0)) {
    table = [table[0], ['--'], ...table.slice(1)]
  }

  for (let y = 0; y < table.length; y++) {
    const row = table[y]
    maxY = Math.max(maxY, row.length)
    for (let x = 0; x < row.length; x++) {
      const cell = String(row[x] ?? '').trim()
      cellLen[x] = Math.max(cellLen[x] || 0, cell.length)
      if (y === 1) {
        orient[x] = cell.endsWith('-:')
          ? cell.startsWith(':-')
            ? 'c'
            : 'r'
          : 'l'
      }
    }
  }

  let str = ''
  for (let y = 0; y < table.length; y++) {
    const row = table[y]
    str += '|'
    const fillChar = y === 1 ? '-' : ' '
    for (let x = 0; x < maxY; x++) {
      const cell = String(row[x] ?? '').trim()
      const len = cellLen[x]
      str += ' '
      switch (orient[x]) {
        case 'r':
          str += cell.padStart(len, fillChar)
          break
        case 'c': {
          if (y === 1) {
            str += ':' + ''.padStart(len - 2, fillChar) + ':'
          } else {
            const half = Math.floor((len - cell.length) / 2)
            str +=
              ''.padStart(half, fillChar) +
              cell +
              ''.padStart(len - cell.length - half, fillChar)
          }
          break
        }
        default:
          str += cell.padEnd(len, fillChar)
          break
      }
      str += ' |'
    }
    str += '\n'
  }

  return str
}
