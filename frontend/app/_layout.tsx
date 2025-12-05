// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack>
        {/* Tela inicial do app */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Grupos de layout */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />

        {/* Modais ou páginas isoladas */}
        <Stack.Screen
          name="configurar-rota"
          options={{ presentation: 'modal', title: 'Configurar Rota' }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
