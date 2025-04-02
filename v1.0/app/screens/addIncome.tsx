import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../auth/firebaseConfig';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/AuthContext';

export default function AddIncome() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Salary',
    paymentMethod: 'bank',
    accountId: '',
    date: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Salary', 'Business', 'Investments', 'Freelance', 'Gift', 'Other'];
  const paymentMethods = ['bank', 'cash', 'cheque', 'online', 'other'];

  // Handle Input Change
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!user || !user.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        amount: Math.abs(parseFloat(formData.amount)),
        description: formData.description,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        accountId: formData.accountId,
        date: formData.date,
        transactionType: "income",
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Income added successfully');
      router.back();
    } catch (error) {
      console.error('Error adding income:', error);
      Alert.alert('Error', 'Failed to add income');
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
          onChangeText={(text) => handleChange('amount', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Source or reason for income"
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={formData.category}
          onValueChange={(itemValue) => handleChange('category', itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Payment Method</Text>
        <Picker
          selectedValue={formData.paymentMethod}
          onValueChange={(itemValue) => handleChange('paymentMethod', itemValue)}
          style={styles.picker}
        >
          {paymentMethods.map((method) => (
            <Picker.Item key={method} label={method.charAt(0).toUpperCase() + method.slice(1)} value={method} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateText}>{formData.date.toLocaleDateString()}</Text>
          <Button title="Select Date" onPress={() => setShowDatePicker(true)} color="#ff4d4d" />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type !== "dismissed") {
                handleChange('date', selectedDate || formData.date);
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

// STYLES
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#ff4d4d",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: "#ff4d4d",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ff4d4d',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  picker: {
    height: 50,
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
});
