
/**
 * shuffle an array (fisher-yates)
 * @param {any[]} arr
 * @returns {any[]} shuffled array
 */
export function shuffle (arr) {
  const _arr = [...arr]

  for (let i = _arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]]
  }

  return _arr
}
