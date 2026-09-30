import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FavoriteButton } from '@/components/FavoriteButton';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PlaceMiniMap } from '@/components/PlaceMiniMap';
import { supabase } from '@/lib/supabase';
import type { Place } from '@/types/database';

export default function PlaceDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setPlace(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#c9741f" />
      </View>
    );
  }

  if (error || !place) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-red-500">{error ?? t('placeDetail.notFound')}</Text>
      </View>
    );
  }

  const openInMaps = () => {
    const label = encodeURIComponent(place.name);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${label}`);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {place.image_url ? (
        <Image source={{ uri: place.image_url }} className="h-64 w-full" resizeMode="cover" />
      ) : (
        <View className="h-40 w-full items-center justify-center bg-brand-100">
          <Text className="text-4xl">🏛️</Text>
        </View>
      )}

      <View className="absolute left-4 top-14">
        <FavoriteButton placeId={place.id} size={22} />
      </View>

      <View className="absolute right-4 top-14">
        <LanguageToggle />
      </View>

      <View className="px-4 pb-8 pt-4">
        <View className="mb-2 self-start rounded-full bg-brand-50 px-2 py-0.5">
          <Text className="text-xs font-medium text-brand-700">
            {t(`category.${place.category}`)}
          </Text>
        </View>

        <Text className="text-2xl font-bold text-gray-900">{place.name}</Text>
        {place.name_local ? (
          <Text className="text-sm text-gray-400">{place.name_local}</Text>
        ) : null}

        {place.rating ? (
          <Text className="mt-2 text-sm text-brand-600">⭐ {place.rating.toFixed(1)}</Text>
        ) : null}

        {place.description ? (
          <Text className="mt-3 text-base leading-6 text-gray-700">{place.description}</Text>
        ) : null}

        {place.address ? (
          <Text className="mt-3 text-sm text-gray-500">📍 {place.address}</Text>
        ) : null}

        {place.tags && place.tags.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {place.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs text-gray-600">#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <PlaceMiniMap lat={place.lat} lng={place.lng} title={place.name} />

        <Pressable
          onPress={openInMaps}
          className="mt-4 items-center rounded-xl bg-brand-500 py-3 active:bg-brand-600"
        >
          <Text className="font-semibold text-white">{t('placeDetail.openInMaps')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
