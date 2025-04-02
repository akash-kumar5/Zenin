import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import { useRouter } from "expo-router";
import { useAuth } from "../auth/AuthContext";

export default function AddIncome() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "Salary",
    paymentMethod: "bank",
    date: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    "Salary",
    "Business",
    "Investments",
    "Freelance",
    "Gift",
    "Other",
  ];
  const paymentMethods = ["bank", "cash", "cheque", "online", "other"];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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

    setLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        amount: Math.abs(parseFloat(formData.amount)),
        description: formData.description,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        date: formData.date,
        transactionType: "income",
        createdAt: new Date(),
      });
      Alert.alert("Success", "Income added successfully");
      router.back();
    } catch (error) {
      console.error("Error adding income:", error);
      Alert.alert("Error", "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Income</Text>

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
              <Text style={styles.bubbleText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {formData.category === "Other" && (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter category"
                    placeholderTextColor="#888"
                    value={formData.otherCategory}
                    onChangeText={(text) => handleChange("otherCategory", text)}
                  />
        )}
      </View>

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
              <Text style={styles.bubbleText}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Adding..." : "Add Income"}
          onPress={handleSubmit}
          disabled={loading}
          color="#d32f2f"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#000" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ff4d4d",
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "500", color: "#ff4d4d" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#fff",
  },
  bubbleContainer: { flexDirection: "row", flexWrap: "wrap" },
  bubble: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderColor: "#ff4d4d",
    borderWidth: 1,
  },
  bubbleSelected: { backgroundColor: "#ff4d4d" },
  bubbleText: { color: "#fff", fontWeight: "500" },
  dateButton: { padding: 10, backgroundColor: "#1a1a1a", borderRadius: 8 },
  dateText: { color: "#fff" },
  buttonContainer: { marginTop: 20 },
});
