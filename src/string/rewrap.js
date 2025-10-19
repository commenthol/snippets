/**
 * rewrap text by words
 * @param {string} str
 * @param {{
 *  column?: number
 *  language?: string
 * }} [param1]
 * @returns {string[]}
 */
export function rewrap(str, { column = 80, language = 'en-US' } = {}) {
  const lines = []
  const segmenter = new Intl.Segmenter(language, { granularity: 'word' })
  const words = segmenter.segment(str)

  let lastWordBreak = 0
  let lastLineBreak = 0
  let nextLineBreak = column
  for (const word of words) {
    if (word.isWordLike) continue
    if (word.index >= nextLineBreak) {
      lines.push(str.slice(lastLineBreak, lastWordBreak))
      lastLineBreak = lastWordBreak
      nextLineBreak = lastWordBreak + column
    }
    lastWordBreak = word.index + word.segment.length
  }
  lines.push(str.slice(lastLineBreak, lastWordBreak))

  return lines
}
