import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export function AdminButton() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.push('/admin')}
      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm shadow-black/10"
    >
      <Text className="text-xs font-semibold text-gray-600">{t('admin.entryLink')}</Text>
    </Pressable>
  );
}
