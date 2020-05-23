
/**
 * convert lowerCamelCase to snake_case
 */
export const toSnakeCase = (str) => str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map(x => x.toLowerCase())
  .join('_')

/**
 * convert snake_case to lowerCamelCase
 */
export const fromSnakeCase = (str) => str
  .replace(/_([a-z])/g, (_, m) => m.toUpperCase())
