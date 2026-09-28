import { Text, View } from 'react-native';

import { LanguageToggle } from '@/components/LanguageToggle';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="flex-row items-start justify-between px-4 pb-2 pt-4">
      <View className="flex-1 pr-3">
        <Text className="text-2xl font-bold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <LanguageToggle />
    </View>
  );
}
