import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { setAppLanguage, type AppLanguage } from '@/i18n';

const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'ko', label: '한국어' },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((lang) => lang.code === i18n.language)?.code ?? 'en';

  const handleSelect = (code: AppLanguage) => {
    setOpen(false);
    if (code !== current) setAppLanguage(code);
  };

  return (
    <View>
      <Pressable
        onPress={() => setOpen((value) => !value)}
        className="rounded-full border border-brand-200 bg-white px-3 py-1.5 shadow-sm shadow-black/10"
      >
        <Text className="text-xs font-semibold text-brand-700">
          {LANGUAGES.find((lang) => lang.code === current)?.label}
        </Text>
      </Pressable>

      {open ? (
        <View className="absolute right-0 top-9 z-10 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-md shadow-black/20">
          {LANGUAGES.map((lang) => (
            <Pressable key={lang.code} onPress={() => handleSelect(lang.code)} className="px-3 py-2">
              <Text
                className={`text-sm ${lang.code === current ? 'font-semibold text-brand-600' : 'text-gray-700'}`}
              >
                {lang.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
