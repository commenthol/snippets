const DAY = 86400000

/**
 * Get day of year in Gregorian year
 * @param {Date} [date] -
 * @return {Number} number of day in year (1 ... 366)
 */
export const dayOfYear = (date = new Date()) => {
  const jan1st = new Date(date.getFullYear(), 0, 1)
  return Math.floor(1 + (date - jan1st) / DAY) // days 1 ... 366
}
