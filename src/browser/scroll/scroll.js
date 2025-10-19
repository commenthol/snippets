/**
 * test if scoll position is a page top
 * @return {bool}
 */
export const scrollAtPageTop = () => window.scrollY === 0

/**
 * test if scoll position is a page bottom
 * @return {bool}
 */
export const scrollAtPageBottom = () =>
  window.innerHeight + window.scrollY >= document.body.offsetHeight

/**
 * scroll vertically by one page
 * @param {bool} [up=false] if `true` scroll up
 */
export const scrollPage = (up = false) => {
  const pos = window.scrollY + window.innerHeight * (up ? -1 : 1)
  window.scrollTo(0, pos)
}
