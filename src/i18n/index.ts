import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en';
import es from './translations/es';
import zh from './translations/zh';
import hi from './translations/hi';
import fr from './translations/fr';

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  hi: { translation: hi },
  fr: { translation: fr },
};

const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: async (cb: (lang: string) => void) => {
    try {
      const storageStr = await AsyncStorage.getItem('settings-storage');
      if (storageStr) {
        const storageObj = JSON.parse(storageStr);
        const state = storageObj?.state;
        // Priority 1: explicit UI language override (only 'en' is a valid override)
        if (state?.uiLanguage === 'en') {
          return cb('en');
        }
        // Priority 2: native language (used as default UI language if no override)
        if (state?.language) {
          return cb(state.language);
        }
      }
    } catch (e) {
      console.warn('Error reading language from storage', e);
    }

    // Priority 3: device locale
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      let lang = locales[0].languageTag.split('-')[0];
      if (!['en', 'es', 'zh', 'hi', 'fr'].includes(lang)) {
        lang = 'es'; // fallback to Spanish if not supported
      }
      cb(lang);
    } else {
      cb('es');
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
