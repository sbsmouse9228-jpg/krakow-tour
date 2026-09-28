import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ScreenHeader } from '@/components/ScreenHeader';
import { useItineraries } from '@/hooks/useItineraries';

export default function ItinerariesScreen() {
  const { t } = useTranslation();
  const { itineraries, loading, error } = useItineraries();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScreenHeader title={t('itineraries.title')} subtitle={t('itineraries.subtitle')} />

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
          data={itineraries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/itinerary/${item.id}`)}
              className="mb-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/10"
            >
              <View className="mb-1 self-start rounded-full bg-brand-50 px-2 py-0.5">
                <Text className="text-xs font-medium text-brand-700">
                  {t('itineraries.days', { count: item.duration_days })}
                </Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
              {item.description ? (
                <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </Pressable>
          )}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">{t('itineraries.empty')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
