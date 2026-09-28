import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useItineraryDetail } from '@/hooks/useItineraries';
import { PlaceCard } from '@/components/PlaceCard';

export default function ItineraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { itinerary, loading, error } = useItineraryDetail(id);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#c9741f" />
      </View>
    );
  }

  if (error || !itinerary) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-red-500">{error ?? '일정을 찾을 수 없습니다.'}</Text>
      </View>
    );
  }

  const days = Array.from(
    new Set(itinerary.itinerary_stops.map((stop) => stop.day_number)),
  ).sort((a, b) => a - b);

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold text-gray-900">{itinerary.title}</Text>
      {itinerary.description ? (
        <Text className="mt-1 text-sm text-gray-500">{itinerary.description}</Text>
      ) : null}

      {days.map((day) => (
        <View key={day} className="mt-5">
          <Text className="mb-2 text-lg font-semibold text-brand-700">Day {day}</Text>
          {itinerary.itinerary_stops
            .filter((stop) => stop.day_number === day)
            .sort((a, b) => a.order_in_day - b.order_in_day)
            .map((stop) =>
              stop.place ? (
                <View key={stop.id}>
                  <PlaceCard place={stop.place} />
                  {stop.note ? (
                    <Text className="-mt-2 mb-2 px-1 text-xs text-gray-400">{stop.note}</Text>
                  ) : null}
                </View>
              ) : null,
            )}
        </View>
      ))}
    </ScrollView>
  );
}
