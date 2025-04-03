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
import { AuthProvider, useAuth } from "./auth/AuthContext";
import TransactionDetails from "./screens/transactionDetails";
import TransactionsScreen from "./(tabs)/transactions";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [isReady, setIsReady] = useState(false);

  return (
    <AuthProvider>
      <AppContent colorScheme={colorScheme} loaded={loaded} />
    </AuthProvider>
  );
}

// Separate Component to access AuthContext
function AppContent({ colorScheme, loaded }) {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    if (!user) {
      router.replace("/auth/login"); // Redirect to login if not authenticated
    }
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false}}> 
        {user ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="/screens/addExpense" />
            <Stack.Screen name="TransactionScreen" component={TransactionsScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetails} />

          </>
        ) : (
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
