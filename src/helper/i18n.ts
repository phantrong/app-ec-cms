import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from 'locales/vi.json';
import en from 'locales/en.json';
import ja from 'locales/ja.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'vi' || 'ja',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      vi: { translation: vi },
      en: { translation: en },
      ja: { translation: ja },
    },
  });
