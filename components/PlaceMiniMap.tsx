import MapView, { Marker } from 'react-native-maps';

export function PlaceMiniMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <MapView
      style={{ height: 180, borderRadius: 16, marginTop: 16 }}
      initialRegion={{
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
    >
      <Marker coordinate={{ latitude: lat, longitude: lng }} title={title} />
    </MapView>
  );
}
