import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { LanguageToggle } from '@/components/LanguageToggle';
import { usePlaces } from '@/hooks/usePlaces';

const KRAKOW_REGION = {
  latitude: 50.0614,
  longitude: 19.9372,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const CATEGORY_PIN_COLOR: Record<string, string> = {
  landmark: '#c9741f',
  museum: '#7c5cbf',
  church: '#3b82f6',
  park: '#22c55e',
  food: '#ef4444',
  cafe: '#b45309',
};

export default function MapScreen() {
  const { t } = useTranslation();
  const { places, loading } = usePlaces();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [locating, setLocating] = useState(false);

  const goToMyLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const position = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } finally {
      setLocating(false);
    }
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={KRAKOW_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            title={place.name}
            description={place.address ?? undefined}
            pinColor={CATEGORY_PIN_COLOR[place.category] ?? '#c9741f'}
            onCalloutPress={() => router.push(`/place/${place.id}`)}
          />
        ))}
      </MapView>

      {loading ? (
        <View className="absolute left-0 right-0 top-14 items-center">
          <ActivityIndicator color="#c9741f" />
        </View>
      ) : null}

      <Pressable
        onPress={goToMyLocation}
        className="absolute bottom-6 right-4 h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-black/20"
      >
        {locating ? (
          <ActivityIndicator color="#c9741f" size="small" />
        ) : (
          <Ionicons name="locate" size={22} color="#c9741f" />
        )}
      </Pressable>

      <View className="absolute left-4 top-14 flex-row items-center gap-2">
        <View className="rounded-xl bg-white/90 px-3 py-1.5 shadow-sm shadow-black/10">
          <Text className="text-xs font-medium text-gray-700">{t('map.title')}</Text>
        </View>
        <LanguageToggle />
      </View>
    </View>
  );
}
