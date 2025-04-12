import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, deleteDoc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/services/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "@/styles/transactionDetailStyle";

export default function TransactionDetails() {
  const { id } = useLocalSearchParams(); // Now only passing transaction ID
  const { user } = useAuth();
  const navigation = useNavigation();

  const [transaction, setTransaction] = useState(null);
  const [isEditPressed, setIsEditPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedAmount, setEditedAmount] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch transaction on mount
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "transactions", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTransaction({ ...data, id: docSnap.id });
          setEditedAmount(data.amount.toString());
          setEditedDescription(data.description || "");
          setEditedDate(
            data.date ? new Date(data.date.seconds * 1000).toISOString().split("T")[0] : ""
          );
          
          setSelectedImage(data.image || null);
        } else {
          Alert.alert("Error", "Transaction not found");
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
        Alert.alert("Error", "Failed to load transaction.");
      }
    };

    if (id && user?.uid) fetchTransaction();
  }, [id, user]);

  const handleSaveEdit = async () => {
    try {
      const updateData = {};
      if (editedAmount) updateData.amount = editedAmount;
      if (editedDescription) updateData.description = editedDescription;
      if (editedDate) updateData.date = Timestamp.fromDate(new Date(editedDate));
      if (selectedImage) updateData.image = selectedImage;

      await updateDoc(doc(db, "users", user.uid, "transactions", id), updateData);

      setModalVisible(false);
      Alert.alert("Success", "Transaction updated.");
      setTransaction(prev => ({ ...prev, ...updateData }));
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Could not update transaction.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Confirm Deletion", "Delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: handleDelete },
    ]);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
      Alert.alert("Success", "Transaction deleted.");
      navigation.goBack();
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Error", "Could not delete transaction.");
    }
  };

  if (!transaction) return null; // or a loading indicator


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>
      <View style={styles.elevatedCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{transaction.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{transaction.amount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{transaction.description || "No description"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(transaction.date.seconds * 1000).toLocaleString()}
          </Text>
        </View>

        {transaction.image && (
          <Image
            source={{ uri: transaction.image }}
            style={{
              width: "100%",
              height: 200,
              marginTop: 10,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, isEditPressed && styles.buttonPressed]}
            onPress={() => setModalVisible(true)}
            onPressIn={() => setIsEditPressed(true)}
            onPressOut={() => setIsEditPressed(false)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isDeletePressed && styles.buttonPressed]}
            onPress={confirmDelete}
            onPressIn={() => setIsDeletePressed(true)}
            onPressOut={() => setIsDeletePressed(false)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Transaction</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new amount"
              keyboardType="numeric"
              onChangeText={setEditedAmount}
              value={editedAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new description"
              onChangeText={setEditedDescription}
              value={editedDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new date"
              onChangeText={setEditedDate}
              value={editedDate}
            />
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <View style={styles.imgBox}>
                <Ionicons name="file-tray-full-outline" size={18} color="#ff4d4d" />
                <Text style={styles.buttonText}>Attach Image</Text>
              </View>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.transactionImage} />
            )}
            <View style={styles.optionBtn}>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
