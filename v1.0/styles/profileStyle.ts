import { StyleSheet } from "react-native";

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

export default styles;