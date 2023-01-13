import { IntlProvider, Message, useTranslation } from './useTranslation.jsx'

function LngSwitch () {
  const { changeLanguage } = useTranslation()

  return (
    <>
      <button onClick={() => changeLanguage('en-US')}>🇺🇸</button>
      <button onClick={() => changeLanguage('fr-FR')}>🇫🇷</button>
      <button onClick={() => changeLanguage('fr')}>fr</button>
    </>
  )
}

function LngShow () {
  const { lng } = useTranslation()
  return (<span>{lng}</span>)
}

export const storyUseTranslation = {
  title: 'useTranslation',
  component: () => {
    const options = {
      fallbackLng: 'en-US',
      backendLngs: ['fr'], // we don't load 'en' here as this is the language of our labels or fallbackLng
      backendPath: '/stories/locales/{lng}.json?v={version}'
    }

    return (
      <IntlProvider options={options}>
        <LngSwitch />
        <div>
          <LngShow /><br/>
          <Message label='translate {value}' value='foobar' /><br/>
          <Message label="cant' translate" />
        </div>
      </IntlProvider>
    )
  }
}
