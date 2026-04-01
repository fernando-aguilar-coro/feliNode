import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en';
import es from './translations/es';
import zh from './translations/zh';
import hi from './translations/hi';

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  hi: { translation: hi },
};

const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: async (cb: (lang: string) => void) => {
    try {
      const storageStr = await AsyncStorage.getItem('settings-storage');
      if (storageStr) {
        const storageObj = JSON.parse(storageStr);
        if (storageObj?.state?.language) {
          return cb(storageObj.state.language);
        }
      }
    } catch (e) {
      console.warn('Error reading language from storage', e);
    }

    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      let lang = locales[0].languageTag.split('-')[0];
      if (!['en', 'es', 'zh', 'hi'].includes(lang)) {
        lang = 'en'; // fallback to English if not supported
      }
      cb(lang);
    } else {
      cb('en');
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Default language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    compatibilityJSON: 'v4', // Required for native text components
  });

export default i18n;
