import '../global.css';
import '../i18n';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import { loadStoredLanguage, setAppLanguage } from '@/i18n';

export default function RootLayout() {
  const { t } = useTranslation();

  useEffect(() => {
    loadStoredLanguage().then((language) => setAppLanguage(language));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="place/[id]"
          options={{ headerShown: true, headerTitle: '', headerTransparent: true }}
        />
        <Stack.Screen
          name="itinerary/[id]"
          options={{ headerShown: true, headerTitle: t('itineraryDetail.title') }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
