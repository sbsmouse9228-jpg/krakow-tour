import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlaceCard } from '@/components/PlaceCard';
import { usePlaces } from '@/hooks/usePlaces';

const SIGHT_CATEGORIES = ['landmark', 'museum', 'church', 'park'] as const;

export default function SightsScreen() {
  const { places, loading, error, refetch } = usePlaces([...SIGHT_CATEGORIES]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">크라쿠프 명소</Text>
        <Text className="text-sm text-gray-500">꼭 가봐야 할 랜드마크와 명소를 둘러보세요</Text>
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
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">등록된 명소가 없습니다.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
