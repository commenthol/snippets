export const isCircular = (obj) => {
  try {
    JSON.stringify(obj)
    return false
  } catch (e) {
    return true
  }
}
