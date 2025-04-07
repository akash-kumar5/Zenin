import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../auth/firebaseConfig";
import { useRouter } from "expo-router";
import { useAuth } from "../auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/styles/formStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";

export default function AddExpense() {
  const router = useRouter();
  const { user } = useAuth();
  const uniqueId = uuid.v4();

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "Food",
    paymentMethod: "cash",
    otherPaymentMethod: "",
    otherCategory: "",
    accountId: "",
    date: new Date(),
    imageUrl: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Healthcare",
    "Other",
  ];
  const paymentMethods = ["cash", "credit", "debit", "transfer", "other"];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImageAndUpload = async (user, formData, setFormData) => {
    try {
      if (!user || !user.uid) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission denied", "Please allow image access");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.2,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const imageUri = result.assets[0].uri;
      // console.log(imageUri);

      if (!imageUri.startsWith("file://") && Platform.OS === "android") {
        Alert.alert("Invalid image", "Image URI is not local");
        return;
      }

      // Convert image to blob
      const response = await fetch(imageUri);
      // console.log(response);

      const blob = await response.blob();
      console.log("blob", blob);

      // Unique file name
      const fileName = `${Date.now()}-${uuid.v4()}.jpg`;
      const imageRef = ref(storage, `receipts/${user.uid}/${fileName}`);
      console.log("imageref", imageRef);

      const snap = await Promise.race([
        uploadBytes(imageRef, blob),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Upload timed out")), 10000)
        ),
      ]);
      console.log("snap", snap);
      
      const downloadURL = await getDownloadURL(snap.ref);
      console.log("downloadurl", downloadURL);

      // Update form data
      setFormData({ ...formData, imageUrl: downloadURL });

      Alert.alert("Success", "Image uploaded successfully");
    } catch (error) {
      console.error("Image pick/upload error:", error);
      Alert.alert(
        "Upload Error",
        error.message || "Something went wrong. Try again."
      );
    }
  };

  const handleSubmit = async () => {
    if (!user || !user.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (
      formData.paymentMethod === "other" &&
      !formData.otherPaymentMethod.trim()
    ) {
      Alert.alert("Error", "Please enter a valid payment method");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        amount: -Math.abs(parseFloat(formData.amount)),
        description: formData.description,
        category:
          formData.category === "Other" && formData.otherCategory
            ? formData.otherCategory
            : formData.category,
        paymentMethod:
          formData.paymentMethod === "other"
            ? formData.otherPaymentMethod.trim()
            : formData.paymentMethod,
        accountId: formData.accountId,
        date: formData.date,
        transactionType: "expense",
        imageUrl: formData.imageUrl,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Expense added successfully");
      router.back();
    } catch (error) {
      console.error("Error adding expense:", error);
      Alert.alert("Error", "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add New Expense</Text>
        <View
          style={{
            height: 2,
            backgroundColor: "#ff4d4d",
            marginBottom: 10,
            width: 160,
          }}
        />

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="00.00"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(text) => handleChange("amount", text)}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What was this expense for?"
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.bubbleContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.bubble,
                  formData.category === cat && styles.bubbleSelected,
                ]}
                onPress={() => handleChange("category", cat)}
              >
                <Ionicons
                  name={
                    cat === "Food"
                      ? "fast-food"
                      : cat === "Transportation"
                      ? "car"
                      : cat === "Entertainment"
                      ? "game-controller"
                      : cat === "Utilities"
                      ? "flash"
                      : cat === "Shopping"
                      ? "cart"
                      : cat === "Healthcare"
                      ? "medkit"
                      : "ellipsis-horizontal-circle-outline"
                  }
                  size={20}
                  color={formData.category === cat ? "#fff" : "#ff4d4d"}
                />
                <Text
                  style={[
                    styles.bubbleText,
                    formData.category === cat && styles.bubbleTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formData.category === "Other" && (
            <TextInput
              style={styles.otherInput}
              placeholder="Enter category"
              placeholderTextColor="#888"
              value={formData.otherCategory}
              onChangeText={(text) => handleChange("otherCategory", text)}
            />
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.bubbleContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.bubble,
                  formData.paymentMethod === method && styles.bubbleSelected,
                ]}
                onPress={() => handleChange("paymentMethod", method)}
              >
                <Ionicons
                  name={
                    method === "cash"
                      ? "cash"
                      : method === "credit"
                      ? "card"
                      : method === "debit"
                      ? "card-outline"
                      : method === "transfer"
                      ? "swap-horizontal"
                      : "ellipsis-horizontal-circle-outline"
                  }
                  size={20}
                  color={formData.paymentMethod === method ? "#fff" : "#ff4d4d"}
                />
                <Text
                  style={[
                    styles.bubbleText,
                    formData.paymentMethod === method &&
                      styles.bubbleTextSelected,
                  ]}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formData.paymentMethod === "other" && (
            <TextInput
              style={styles.otherInput}
              placeholder="Enter payment method"
              placeholderTextColor="#888"
              value={formData.otherPaymentMethod}
              onChangeText={(text) => handleChange("otherPaymentMethod", text)}
            />
          )}
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {formData.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (event.type !== "dismissed") {
                  handleChange("date", selectedDate || formData.date);
                }
              }}
            />
          )}
        </View>

        {/* Image Picker */}
        {/* <View style={styles.inputGroup}>
          <Button
            title="Attach Image"
            onPress={() => pickImageAndUpload(user, formData, setFormData)}
            color="#d32f2f"
          />
          {formData.imageUri && (
            <Image
              source={{ uri: formData.imageUri }}
              style={{
                width: "100%",
                height: 200,
                marginTop: 10,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          )}
        </View> */}

        {/* Submit */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Adding..." : "Add Expense"}
            onPress={handleSubmit}
            disabled={loading}
            color="#d32f2f"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
