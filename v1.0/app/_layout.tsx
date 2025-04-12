// app/_layout.tsx
import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { Stack, Slot, router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/services/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <AppContent colorScheme={colorScheme} />
    </AuthProvider>
  );
}

function AppContent({ colorScheme }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user === null) {
      router.replace("/auth/login");
    }
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <Stack screenOptions={{ headerShown: false }} /> */}
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
