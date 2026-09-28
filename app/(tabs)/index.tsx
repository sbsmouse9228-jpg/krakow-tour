import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { PlaceCard } from '@/components/PlaceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePlaces } from '@/hooks/usePlaces';

const SIGHT_CATEGORIES = ['landmark', 'museum', 'church', 'park'] as const;

export default function SightsScreen() {
  const { t } = useTranslation();
  const { places, loading, error, refetch } = usePlaces([...SIGHT_CATEGORIES]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScreenHeader title={t('sights.title')} subtitle={t('sights.subtitle')} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#c9741f" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">{t('sights.empty')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
