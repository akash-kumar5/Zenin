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
import { doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionDetails() {
  const { transaction } = useLocalSearchParams(); // Getting transaction details
  const { user } = useAuth();
  const navigation = useNavigation();

  const parsedTransaction = transaction ? JSON.parse(transaction) : {};

  // State variables
  const [isEditPressed, setIsEditPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedAmount, setEditedAmount] = useState(parsedTransaction.amount.toString());
  const [editedDescription, setEditedDescription] = useState(parsedTransaction.description || "");
  const [editedDate, setEditedDate] = useState(
    parsedTransaction.date 
      ? new Date(parsedTransaction.date.seconds * 1000).toISOString().split("T")[0]
      : ""
  );
  const [selectedImage, setSelectedImage] = useState(parsedTransaction.image || null);

  const handleSaveEdit = async () => {
  try {
    const updateData = {};

    if (editedAmount) updateData.amount = editedAmount;
    if (editedDescription) updateData.description = editedDescription;
    if (editedDate) updateData.date = Timestamp.fromDate(new Date(editedDate));
    if (selectedImage) updateData.image = selectedImage;

    await updateDoc(
      doc(db, "users", user.uid, "transactions", parsedTransaction.id),
      updateData // Only update non-empty fields
    );

    setModalVisible(false);
    Alert.alert("Success", "Transaction updated successfully.");
  } catch (error) {
    console.error("Failed to update transaction", error);
    Alert.alert("Error", "Failed to update transaction.");
  }
};


  // Function to pick an image
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

  // Function to confirm before deleting a transaction
  const confirmDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ]
    );
  };

  // Function to delete the transaction
  const handleDelete = async () => {
    try {
      const transactionRef = doc(db, "users", user.uid, "transactions", parsedTransaction.id);
      await deleteDoc(transactionRef);
      Alert.alert("Success", "Transaction deleted successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to delete transaction.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>
      <View style={styles.elevatedCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{parsedTransaction.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{parsedTransaction.amount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{parsedTransaction.description || "No description"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(parsedTransaction.date.seconds * 1000).toLocaleString()}
          </Text>
        </View>
        {parsedTransaction?.image ? (
          <Image source={{ uri: parsedTransaction.image }} style={styles.transactionImage} />
        ):null}
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
              <Ionicons name="file-tray-full-outline" size={18} color="#ff4d4d"/>
              <Text style={styles.buttonText}>
                Attach Image</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212", // Black background
    
  },
  elevatedCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginVertical: 5,
    padding: 17,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff4d4d", // Red heading
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  transactionImage: {
    color:"#fff",
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center",
  },
  imageButton: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    borderWidth:1,
    borderColor:"#ff4d4d",
    margin:12
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4d4d",
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ff4d4d", // Red separator line
  },
  label: {
    fontWeight: "bold",
    color: "#ff4d4d", // Red labels
  },
  value: {
    fontSize: 16,
    color: "#fff", // White values
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 5,
    borderRadius: 5,
    width: "50%",
    borderWidth:1,
    borderColor: "#ff4d4d",
    marginVertical:4
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1e1e1e",

    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },
  buttonText: {
    color: "#ff4d4d",
    fontWeight: "bold",
    marginHorizontal:3
  },
  buttonPressed: {
    backgroundColor: "#ff4d4d",
  },
  optionBtn:{
    flexDirection:"row",
    justifyContent:'space-between'
  },
  imgBox:{
    flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  }
});
