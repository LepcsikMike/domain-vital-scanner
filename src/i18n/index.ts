
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import landingDE from './translations/de/landing.json';
import landingEN from './translations/en/landing.json';
import landingES from './translations/es/landing.json';
import appDE from './translations/de/app.json';
import appEN from './translations/en/app.json';
import appES from './translations/es/app.json';
import reportsDE from './translations/de/reports.json';
import reportsEN from './translations/en/reports.json';
import reportsES from './translations/es/reports.json';
import legalDE from './translations/de/legal.json';
import legalEN from './translations/en/legal.json';
import legalES from './translations/es/legal.json';

const resources = {
  de: {
    landing: landingDE,
    app: appDE,
    reports: reportsDE,
    legal: legalDE,
  },
  en: {
    landing: landingEN,
    app: appEN,
    reports: reportsEN,
    legal: legalEN,
  },
  es: {
    landing: landingES,
    app: appES,
    reports: reportsES,
    legal: legalES,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    defaultNS: 'landing',
    ns: ['landing', 'app', 'reports', 'legal'],
    
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
    },

    interpolation: {
      escapeValue: false,
    },

    supportedLngs: ['de', 'en', 'es'],
  });

export default i18n;
