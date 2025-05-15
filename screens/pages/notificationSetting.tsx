import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Button,
  NativeModules,
  Platform,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';

export default function NotificationSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const checkNotificationAccess = async () => {
    if (
      Platform.OS === 'android' &&
      NativeModules.NotificationAccess?.isEnabled
    ) {
      const enabled = await NativeModules.NotificationAccess.isEnabled();
      setIsEnabled(enabled);
    } else {
      console.warn(
        'NotificationAccess module is not available or unsupported platform.',
      );
    }
  };

  const openNotificationAccess = () => {
    if (
      Platform.OS === 'android' &&
      NativeModules.NotificationAccess?.openSettings
    ) {
      NativeModules.NotificationAccess.openSettings();
    } else {
      Linking.openSettings(); // fallback for iOS or unlinked module
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkNotificationAccess().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    checkNotificationAccess();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.title}>Notification Settings</Text>
      <View
        style={{
          height: 2,
          backgroundColor: '#ff4d4d',
          marginBottom: 10,
          width: 160,
        }}
      />
      {/* <Text style={{marginBottom: 10, fontSize: 16}}>
        Notification Access: {isEnabled ? 'Enabled' : 'Disabled'}
      </Text> */}
      <TouchableOpacity onPress={openNotificationAccess} style={styles.button}>
        <Text style={styles.text}>Open Notification Access Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#0d0d0d',
        paddingVertical:40 // Dark background
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E4E4E4', // Light grey text for dark mode
        marginBottom: 20,
        textAlign: 'center',
      },
      text: {
        color: '#E4E4E4',
      },
      button:{
       borderWidth:1,
       borderColor: '#ff4d4d',
       padding:7,
       borderRadius:43,
      }
});
