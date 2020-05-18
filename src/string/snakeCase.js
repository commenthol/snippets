
/**
 * convert lowerCamelCase to snake_case
 */
export const toSnakeCase = (str) => str
  .replace(/[A-Z]/g, m => `_${m.toLowerCase()}`)

/**
 * convert snake_case to lowerCamelCase
 */
export const fromSnakeCase = (str) => str
  .replace(/_([a-z])/g, (_, m) => m.toUpperCase())
