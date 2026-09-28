import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ko from './locales/ko.json';

export const LANGUAGE_STORAGE_KEY = 'app-language';
export type AppLanguage = 'en' | 'ko';

export async function loadStoredLanguage(): Promise<AppLanguage> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'ko' ? 'ko' : 'en';
}

export async function setAppLanguage(language: AppLanguage) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
}

i18n.use(initReactI18next).init({
  // 여행객 대상 앱이므로 기기 로케일과 무관하게 영어를 기본값으로 시작한다.
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
