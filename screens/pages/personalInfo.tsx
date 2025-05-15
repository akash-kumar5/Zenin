import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../services/AuthContext";
import { db } from "../../utils/firebaseConfig";

export default function PersonalInfo({navigation}) {
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(""); // We'll fetch from Firestore separately if needed
  const [initialName, setInitialName] = useState(user?.displayName || "");
  const [initialPhone, setInitialPhone] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const profileRef = doc(db, "users", user.uid, "profile", "info");
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          if (data.name) setName(data.name);
          if (data.phone) setPhone(data.phone);

          setInitialName(data.name || "");
          setInitialPhone(data.phone || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const profileRef = doc(db, "users", user.uid, "profile", "info");
      await setDoc(profileRef, { name, phone }, { merge: true });

      Alert.alert("Success", "Your profile has been updated.");
      navigation.goBack(); // Navigate back after saving
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const isButtonDisabled = name === initialName && phone === initialPhone;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Edit Personal Information</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.saveButton, isButtonDisabled && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={isButtonDisabled}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  sectionTitle: {
    color: "#e74c3c",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    color: "#fff",
    backgroundColor: "#111",
  },
  saveButton: {
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
