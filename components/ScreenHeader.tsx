import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { AdminButton } from '@/components/AdminButton';
import { LanguageToggle } from '@/components/LanguageToggle';

export function ScreenHeader({
  title,
  subtitle,
  extra,
}: {
  title: string;
  subtitle: string;
  extra?: ReactNode;
}) {
  return (
    <View
      className="flex-row items-start justify-between px-4 pb-2 pt-4"
      style={{ zIndex: 50, elevation: 50 }}
    >
      <View className="flex-1 pr-3">
        <Text className="text-2xl font-bold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <View className="items-end gap-1">
        {extra}
        <View className="flex-row items-center gap-2">
          <LanguageToggle />
          <AdminButton />
        </View>
      </View>
    </View>
  );
}
