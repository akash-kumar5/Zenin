import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeModules, Platform } from 'react-native';

import BottomTabs from './BottomTabs';
import { useAuth } from './services/AuthContext';
import Login from './screens/auth/login';
import Signup from './screens/auth/signup';
import AddExpense from './screens/pages/addExpense';
import AddIncome from './screens/pages/addIncome';
import TransactionDetails from './screens/pages/transactionDetails';
import PersonalInfo from './screens/pages/personalInfo';
import TextParser from './screens/pages/textParser';
import NotificationSettings from './screens/pages/notificationSetting';
import AddOptions from './components/AddOptions';

const Stack = createNativeStackNavigator();
const { NotificationAccess } = NativeModules;

export default function AppNavigator() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkNotificationAccess = async () => {
      if (Platform.OS === 'android' && user) {
        try {
          const granted = await NotificationAccess.isNotificationAccessGranted();
          if (!granted) {
            NotificationAccess.openSettings(); // only open if not granted
          }
        } catch (err) {
          console.warn('Error checking notification access:', err);
        }
      }
    };
  
    checkNotificationAccess();
  }, [user]);

  if (loading) return null; // Show splash maybe

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainApp" component={BottomTabs} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Group>
      )}
      <Stack.Screen name="AddExpense" component={AddExpense} />
      <Stack.Screen name="AddIncome" component={AddIncome} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
      <Stack.Screen name="TextParser" component={TextParser} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="AddOptions" component={AddOptions} options={{presentation:"transparentModal"}} />
    </Stack.Navigator>
  );
}
