import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { LanguageToggle } from '@/components/LanguageToggle';
import { PlaceCard } from '@/components/PlaceCard';
import { usePlaces } from '@/hooks/usePlaces';

export default function MapScreen() {
  const { t } = useTranslation();
  const { places, loading } = usePlaces();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View
        className="flex-row items-start justify-between px-4 pb-2 pt-4"
        style={{ zIndex: 50, elevation: 50 }}
      >
        <View className="flex-1 pr-3">
          <Text className="text-2xl font-bold text-gray-900">{t('map.title')}</Text>
          <Text className="text-sm text-gray-500">{t('map.webNotice')}</Text>
        </View>
        <LanguageToggle />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#c9741f" />
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
}
