import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (cb: (lang: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem('userLanguage');
      if (storedLanguage) {
        return cb(storedLanguage);
      }
      
      // Get device locale using Expo Localization
      const deviceLocale = Localization.locale;
      const deviceLanguage = deviceLocale ? deviceLocale.split('-')[0] : 'es';
      
      // Default to Spanish if device language is not English
      const finalLanguage = deviceLanguage === 'en' ? 'en' : 'es';
      cb(finalLanguage);
    } catch (error) {
      console.error('Language detection error:', error);
      cb('es'); // Fallback to Spanish
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    try {
      await AsyncStorage.setItem('userLanguage', lang);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

// Initialize i18n
const initI18n = async () => {
  try {
    await i18n
      .use(languageDetector as any)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'es',
        debug: __DEV__, // Enable debug in development
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        compatibilityJSON: 'v3', // Add for React Native compatibility
      });
      
    console.log('i18n initialized successfully');
  } catch (error) {
    console.error('i18n initialization error:', error);
  }
};

// Initialize immediately
initI18n();

export default i18n;