import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { Ionicons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Zenin",
          headerShown:true,
          tabBarIcon: ({ size,color }) => (
            <Ionicons size={size} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerShown:true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} name="bar-chart-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: "Deals",
          headerShown:true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} name="pricetag-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown:true,
          tabBarIcon: ({ size ,color }) => (
            <Ionicons size={size} name="receipt-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown:true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
