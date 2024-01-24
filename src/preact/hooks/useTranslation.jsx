import { createContext } from 'preact'
import { useContext, useState, useEffect } from 'preact/hooks'

const Context = createContext({})

const DEFAULT_OPTIONS = {
  version: String(Math.random().toString(36)).slice(2),
  fallbackLng: 'en-US',
  backendLngs: [],
  backendPath: '/locales/{lng}.json?v={version}',
  resources: {}
}
const I18N_LOCALE = 'i18nLocale'

const mainLng = (lng = '') => (lng.split(/[_-]/, 1) || [])[0]

const format = (message, values) => message.replace(/{([^}]+)}/g, (m, key) => values[key] || m)

/**
 * @typedef {object} I18nOptions
 * @property {string} [language] initial language
 * @property {string} [fallbackLng='en-US'] fallback language (shall be the language used by labels)
 * @property {string[]} [backendLngs] list of languages which can be loaded from the backend
 * @property {{[lng:string]: {[string]: string}}} [resources] translation resources
 * @property {string} [backendPath='/locales/{lng}.json?v={version}'] path to load translation resources
 * @property {string} [version] version for backendPath replacement
 */

class I18n {
  /**
   * @param {I18nOptions} opts
   */
  constructor (opts) {
    const {
      language,
      fallbackLng,
      version,
      backendPath,
      backendLngs,
      resources
    } = { ...DEFAULT_OPTIONS, ...opts }
    this.fallbackLng = fallbackLng
    this.language = language
    this.resources = resources
    this.backendPath = backendPath
    this.backendLngs = backendLngs
    this.version = version
  }

  /**
   * @param {string} label
   * @param {object} [values]
   * @returns {string}
   */
  t (label, values) {
    if (!label) return ''
    const { language, fallbackLng } = this
    const { lng = language } = values || {}
    const main = mainLng(lng)
    const message = this.resources[lng]?.[label] ||
      this.resources[main]?.[label] ||
      this.resources[fallbackLng]?.[label] ||
      label
    return format(message, values)
  }

  _getDefaultLng () {
    const lsLng = localStorage.getItem(I18N_LOCALE)
    const uaLng = navigator?.language
    return (lsLng || uaLng || this.fallbackLng)
  }

  /**
   * get list of user languages
   * @param {string} [lng]
   * @returns {string[]}
   */
  getLanguages (lng) {
    const uaLngs = navigator?.languages
    return [lng, this.language, ...uaLngs].filter(Boolean)
  }

  /**
   * reset the set user language and use the browser default
   * @param {boolean} [remove] remove the resource
   */
  resetLanguage (remove) {
    localStorage.removeItem(I18N_LOCALE)
    if (remove) Reflect.deleteProperty(this.resources, this.language)
    this.language = this._getDefaultLng()
  }

  /**
   * change the user language
   * @param {string} [lng]
   * @returns {Promise<boolean>}
   */
  async changeLanguage (lng) {
    const doLoad = async lng => !this.backendLngs.includes(lng)
      ? false
      : this.resources[lng]
        ? true // don't re-fetch again
        : await this.loadLanguage(lng)

    const _lng = lng || this.language || this._getDefaultLng()
    const main = mainLng(_lng)
    let ok = await doLoad(_lng)
    if (!ok && main !== _lng) { // try with main language
      ok = await doLoad(main)
    }
    if (ok || mainLng(_lng) === mainLng(this.fallbackLng)) {
      this.language = _lng
      if (_lng === this.fallbackLng || _lng === navigator?.language) {
        localStorage.removeItem(I18N_LOCALE)
      } else if (lng) {
        localStorage.setItem(I18N_LOCALE, lng)
      }
    }
    return ok
  }

  /**
   * loads a language
   * @param {string} lng
   * @returns {Promise<boolean>}
   */
  async loadLanguage (lng) {
    try {
      const { version } = this
      const pathname = format(this.backendPath, { lng, version })
      const res = await fetch(pathname)
      if (res.ok) {
        const resource = await res.json()
        if (resource) {
          this.resources[lng] = resource
          return true
        }
      }
    } catch (err) {
      console.error(err.message)
    }
    return false
  }
}

/**
 * @typedef {object} IntlContext
 * @property {I18n} i18n
 * @property {string} lng selected language
 * @property {(label: string, values?: object) => string} t translate function
 * @property {(lng?: string) => Promise} changeLanguage change language
 * @property {(lng?: string) => string[]} getLanguages get all user languages
 */

/**
 * IntlProvider
 *
 * Provides the i18n context for useTranslation hook
 *
 * @param {object} props
 * @param {I18nOptions} [props.options]
 * @param {preact.AnyComponent} props.fallback loader component
 * @param {preact.AnyComponent} props.children
 * @returns {preact.VNode}
 */
export function IntlProvider (props) {
  const {
    options,
    fallback,
    children
  } = props

  const fallbackC = fallback || (<div>Loading...</div>)
  const [isLoading, setIsLoading] = useState(true)
  const [instance] = useState(() => new I18n(options))
  const [_lng, setLng] = useState('')

  const changeLanguage = async (lng) => {
    if (lng === _lng) return
    setIsLoading(true)
    await instance.changeLanguage(lng)
    setLng(instance.language)
    setIsLoading(false)
  }

  useEffect(() => {
    changeLanguage()
  }, [])

  /** @type {IntlContext} */
  const value = {
    lng: _lng,
    i18n: instance,
    t: (...args) => instance.t(...args),
    getLanguages: (lng) => instance.getLanguages(lng),
    changeLanguage
  }

  return (
    <Context.Provider
      // @ts-ignore
      value={value} >
      {isLoading ? fallbackC : children}
    </Context.Provider>
  )
}

/**
 * a very simple translation hook which allows to replace variables using curly
 * brackets. ICU plurals and date or number formatting is NOT supported.
 *
 * Needs <IntlProvider> to provide the context
 *
 * @returns {IntlContext}
 */
export const useTranslation = () => useContext(Context)

/**
 * @typedef {{
 *  label: string
 *  [key:string]?: any
 * }} MessageProps
 */

/**
 * Message component to render translated texts
 *
 * @param {MessageProps} props
 * @returns {string}
 */
export function Message (props) {
  const { label, children, ...values } = props
  const { t } = useTranslation()
  return t(label, values)
}
