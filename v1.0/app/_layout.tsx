// app/_layout.tsx
import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { Slot, router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/services/AuthContext";
import { getAuth } from "firebase/auth";
import askNotificationPermission from "@/utils/askNotiPermission";
import { AppRegistry } from "react-native";
import HeadlessNotificationTask from "@/services/notificationTask"

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!loaded) return null;


  AppRegistry.registerComponent('main', () => App);

// Register headless task
AppRegistry.registerHeadlessTask(
  'RNPushNotificationListenerService',
  () => HeadlessNotificationTask
);

  return (
    <AuthProvider>
      <AppContent colorScheme={colorScheme} />
    </AuthProvider>
  );
}

function AppContent({ colorScheme }) {
  const { user } = useAuth();

  useEffect(() => {
    askNotificationPermission();
  }, []);


  useEffect(() => {
    if (user === null) {
      router.replace("/auth/login");
    }
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
