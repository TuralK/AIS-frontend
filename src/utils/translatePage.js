import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';

const resources = {
  en: { translation: translationEN },
  tr: { translation: translationTR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback if translation is missing
    interpolation: {
      escapeValue: false,
    }
    // backend: {
    //   allowMultiLoading: false,
    //   crossDomain: false,
    //   withCredentials: false,
    // }
  });

export default i18n;