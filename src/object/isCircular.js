export const isCircular = (obj) => {
  try {
    JSON.stringify(obj)
    return false
  } catch (_err) {
    return true
  }
}
