import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "../auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function AddExpense() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const router = useRouter();

//   useEffect(() => {
//     navigation.setOptions({
//         title: "Add Expense", // Example option
//         headerStyle: {
//             backgroundColor: "#ff4d4d",
//         },
//         headerTintColor: "#fff",
//     });
// }, [navigation]);

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "Food",
    paymentMethod: "cash",
    accountId: "",
    date: new Date(),
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

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user || !user.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        amount: -Math.abs(parseFloat(formData.amount)), // Ensure negative for expense
        description: formData.description,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        accountId: formData.accountId,
        date: formData.date,
        transactionType: "expense",
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="What was this expense for?"
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
        />
      </View>

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
                    : "help"
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


      <View style={styles.inputGroup}>
        <Text style={styles.label}>Payment Method</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowPaymentOptions(true)}
        >
          <Text style={styles.dropdownText}>
            {formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1)}
          </Text>
        </TouchableOpacity>

        <Modal visible={showPaymentOptions} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowPaymentOptions(false)}
          />
          <View style={styles.modalContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={styles.modalOption}
                onPress={() => {
                  handleChange("paymentMethod", method);
                  setShowPaymentOptions(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>


      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateText}>{formData.date.toLocaleDateString()}</Text>
          <Button
            title="Select Date"
            onPress={() => setShowDatePicker(true)}
            color="#ff4d4d"
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type !== "dismissed") {
                handleChange("date", selectedDate || formData.date);
              }
            }}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Adding..." : "Add Expense"}
          onPress={handleSubmit}
          disabled={loading}
          color="#d32f2f"
        />
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ff4d4d",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: "#ff4d4d",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#1a1a1a",
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    margin: 20,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ff4d4d",
    marginBottom: 5,
  },
  bubbleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    marginBottom: 10,
  },
  bubbleSelected: {
    backgroundColor: "#ff4d4d",
  },
  bubbleText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#ff4d4d",
  },
  bubbleTextSelected: {
    color: "#fff",
  },
  otherCategory: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    marginBottom: 10,
    backgroundColor: "#262626",
  },
  otherInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  paymentMethodContainer: {
    padding: 10,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 10,
  },
  paymentOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ff4d4d",
  },
  paymentOptionText: {
    fontSize: 16,
    color: "#ff4d4d",
  },
  paymentOptionSelected: {
    backgroundColor: "#ff4d4d",
  },
  paymentOptionTextSelected: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    width: "80%",
  },
  closeModalButton: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    marginTop: 8,

  },
  dropdownText: {
    fontSize: 16,
    color: "#fff",
  },
  modalOption: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ff4d4d",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#fff",
  },
});
