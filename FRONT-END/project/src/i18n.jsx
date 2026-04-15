import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
    .use(Backend) // carrega traduções de /public/locales
    .use(LanguageDetector) // Detecta linguagem do usuario
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        debug: true,
        interpolation:{
            escapeValue: false
        }
    })

export default i18n