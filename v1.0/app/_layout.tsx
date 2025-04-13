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
import NotificationListener from "react-native-notification-listener";
import { isFinancialMessage, parseMessage, saveParsedTransaction } from "@/utils/messageParser";
import { getAuth } from "firebase/auth";

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
    // Request notification permission
    // Ensure notification permissions are granted (adjust based on your notification library's API)
    NotificationListener.requestPermission?.();

    // Listen for notifications
    const subscription = NotificationListener.onNotificationReceived(
      async (notification) => {
        const msg = notification.text || notification.title || "";
        console.log("Notification received:", msg);

        if (isFinancialMessage(msg)) {
          const parsed = parseMessage(msg);
          if (parsed) {
            const uid = getAuth().currentUser?.uid;
            if (uid) await saveParsedTransaction(uid, parsed);
            console.log("Transaction saved from notification");
          } else {
            console.log("Could not parse the message");
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);
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
