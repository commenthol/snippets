/**
 * obtain the IANA locale from a string in correct upper, lowercase
 * splits language and region
 * @see https://tools.ietf.org/search/bcp47
 * @see https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * @param {string|undefined} locale
 * @param {string} [def='en'] default language
 * @returns {{locale: string, language: string, region?: string}}
 */
export function ianaLocale (locale, def) {
  const arr = (locale || '').split(/[-_]/)
  let language = def || 'en'
  let region
  arr.forEach(item => {
    if (/^[a-z]{2}$/.test(item)) {
      language = item
    } else if (/^[A-Z]{2}|[0-9]{3}$/.test(item)) {
      region = item
    }
  })
  return {
    locale: [language, region].filter(Boolean).join('-'),
    language,
    region
  }
}
