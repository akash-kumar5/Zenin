import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import SignUp from "../auth/Signup";

export default function Profile() {
  const { user,logout } = useAuth();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState("Akash Singh");
  const [phone, setPhone] = useState("+91 8709654752");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);


  const toggleEditModal = () => setEditModalVisible(!isEditModalVisible);

  const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        Alert.alert("Logout Failed", error.message);
      }
    };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://i.imgur.com/6VBx3io.png' }} // Placeholder profile picture
          style={styles.profilePic}
        />
        <Text style={styles.username}>{user.email? user.email.split('@')[0] : null}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person" size={20} color="#e74c3c" />
          <Text style={styles.settingText}>Personal Information</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="lock-closed" size={20} color="#e74c3c" />
          <Text style={styles.settingText}>Security & Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={20} color="#e74c3c" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="payment" size={20} color="#e74c3c" />
          <Text style={styles.settingText}>Payment Methods</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="settings" size={20} color="#e74c3c" />
          <Text style={styles.settingText}>App Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  email: {
    color: '#aaa',
    fontSize: 14,
  },
  settingsContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#e74c3c',
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});