import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en.json'
import es from './lang/es.json'
import it from './lang/it.json'
import fr from './lang/fr.json'
import appConfig from '@/configs/app.config'

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    },
    it: {
        translation: it,
    },
    fr: {
        translation: fr,
    },
}

let initialLng = appConfig.locale
try {
    const stored = JSON.parse(localStorage.getItem('locale') || '{}')
    if (stored?.state?.currentLang) {
        initialLng = stored.state.currentLang
    }
} catch {
    // ignore
}

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: appConfig.locale,
    lng: initialLng,
    interpolation: {
        escapeValue: false,
    },
})

export const dateLocales: {
    [key: string]: () => Promise<ILocale>
} = {
    en: () => import('dayjs/locale/en'),
    es: () => import('dayjs/locale/es'),
    it: () => import('dayjs/locale/it'),
    fr: () => import('dayjs/locale/fr'),
}

export default i18n
