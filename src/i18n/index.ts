import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import frTranslations from './locales/fr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      }
    },
    fallbackLng: 'fr', // Changed to French as default
    lng: 'fr', // Set initial language to French
    debug: false,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['querystring', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      htmlTag: document.documentElement,
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n 
