import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function VisitorBadge({ count }: { count: number | null }) {
  const { t } = useTranslation();

  if (count === null) return null;

  return (
    <View className="rounded-full border border-gray-200 bg-white px-3 py-1">
      <Text className="text-xs font-medium text-gray-500">
        {t('sights.visitCount', { count: count.toLocaleString() })}
      </Text>
    </View>
  );
}
