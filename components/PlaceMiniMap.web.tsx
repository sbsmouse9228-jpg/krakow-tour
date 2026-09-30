import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function PlaceMiniMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  const { t } = useTranslation();
  void lat;
  void lng;
  void title;

  return (
    <View
      style={{ height: 180, borderRadius: 16, marginTop: 16, overflow: 'hidden' }}
      className="items-center justify-center bg-gray-100"
    >
      <Text className="px-4 text-center text-sm text-gray-500">
        {t('placeDetail.mapUnavailableWeb')}
      </Text>
    </View>
  );
}
