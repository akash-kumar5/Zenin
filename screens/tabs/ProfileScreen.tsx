import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useAuth } from '../../services/AuthContext';
import  Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../styles/profileStyle';

export default function Profile({ navigation }) {
  const { user, logout } = useAuth();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const toggleEditModal = () => setEditModalVisible(!isEditModalVisible);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Please log in to view your profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://i.imgur.com/6VBx3io.png' }} // Placeholder profile picture
          style={styles.profilePic}
        />
        <Text style={styles.username}>
          {user?.email ? user.email.split('@')[0] : 'Guest'}
        </Text>
        <Text style={styles.email}>{user?.email || 'No email available'}</Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('PersonalInfo')}>
          <Ionicons name='person' size={20} color='#e74c3c' />
          <Text style={styles.settingText}>Personal Information</Text>
          <Ionicons name='chevron-forward' size={20} color='#aaa' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name='lock-closed' size={20} color='#e74c3c' />
          <Text style={styles.settingText}>Security & Privacy</Text>
          <Ionicons name='chevron-forward' size={20} color='#aaa' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('NotificationSettings')}>
          <Ionicons name='notifications' size={20} color='#e74c3c' />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name='chevron-forward' size={20} color='#aaa' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          {/* <MaterialIcons name='payment' size={20} color='#e74c3c' /> */}
          <Ionicons name='payment' size={20} color='#e74c3c' />
          <Text style={styles.settingText}>Payment Methods</Text>
          <Ionicons name='chevron-forward' size={20} color='#aaa' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name='settings' size={20} color='#e74c3c' />
          <Text style={styles.settingText}>App Settings</Text>
          <Ionicons name='chevron-forward' size={20} color='#aaa' />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
