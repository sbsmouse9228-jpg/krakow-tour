import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { setAppLanguage, type AppLanguage } from '@/i18n';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = (i18n.language as AppLanguage) === 'ko' ? 'ko' : 'en';

  const toggle = () => {
    setAppLanguage(current === 'en' ? 'ko' : 'en');
  };

  return (
    <Pressable
      onPress={toggle}
      className="rounded-full border border-brand-200 bg-white px-3 py-1.5 shadow-sm shadow-black/10"
    >
      <Text className="text-xs font-semibold text-brand-700">
        {current === 'en' ? '한국어' : 'English'}
      </Text>
    </Pressable>
  );
}
