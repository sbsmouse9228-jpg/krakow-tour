import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { CategoryFilterChips } from '@/components/CategoryFilterChips';
import { PlaceCard } from '@/components/PlaceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { usePlaces } from '@/hooks/usePlaces';
import type { PlaceCategory } from '@/types/database';
import { filterPlaces } from '@/utils/filterPlaces';

const FOOD_CATEGORIES: PlaceCategory[] = ['food', 'cafe'];

export default function FoodScreen() {
  const { t } = useTranslation();
  const { places, loading, error, refetch } = usePlaces(FOOD_CATEGORIES);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');

  const filteredPlaces = useMemo(
    () => filterPlaces(places, query, category),
    [places, query, category],
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
        <ScreenHeader title={t('food.title')} subtitle={t('food.subtitle')} />
        <SearchBar value={query} onChangeText={setQuery} />
        <CategoryFilterChips categories={FOOD_CATEGORIES} selected={category} onSelect={setCategory} />
      </View>

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
          style={{ flex: 1 }}
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">{t('food.empty')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
