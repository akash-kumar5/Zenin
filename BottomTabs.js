import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/tabs/HomeScreen';
import ProfileScreen from './screens/tabs/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnalyticsScreen from './screens/tabs/Analytics';
import DealScreen from './screens/tabs/Deals';
import TransactionScreen from './screens/tabs/Transactions';
import {Colors} from './constants/Colors'; // adjust path as needed
// import {useColorScheme} from 'react-native'; // built-in hook

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  // const scheme = useColorScheme(); // returns 'dark' or 'light'
  const themeColors = Colors['dark']; // fallback to dark

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Analytics') iconName = 'bar-chart-outline';
          else if (route.name === 'Deals') iconName = 'pricetag-outline';
          else if (route.name === 'Transactions') iconName = 'receipt-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: true,
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: themeColors.text,
        },
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'Zenin',
          headerRight: () => (
            <Ionicons
              name="add-circle-outline"
              size={28}
              color={themeColors.text}
              style={{marginRight: 15}}
              onPress={
                () => navigation.navigate('AddOptions') // You can name this whatever screen handles Add
              }
            />
          ),
        })}
      />

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{title: 'Analytics'}}
      />
      <Tab.Screen
        name="Deals"
        component={DealScreen}
        options={{title: 'Deals'}}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{title: 'Transactions'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}
