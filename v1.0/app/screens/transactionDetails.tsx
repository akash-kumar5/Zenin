import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TransactionDetails() {
  const { transaction } = useLocalSearchParams(); // Corrected hook

  const [isEditPressed, setIsEditPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);


  // Parse transaction safely
  const parsedTransaction = transaction ? JSON.parse(transaction) : {};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>
      <View style={styles.elevatedCard}>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{parsedTransaction.category}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹{parsedTransaction.amount}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(parsedTransaction.date.seconds * 1000).toLocaleDateString()}</Text>
      </View>
      <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, isEditPressed && styles.buttonPressed]}
            onPress={() => console.log("Edit Pressed")}
            onPressIn={() => setIsEditPressed(true)}
            onPressOut={() => setIsEditPressed(false)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isDeletePressed && styles.buttonPressed]}
            onPress={() => console.log("Delete Pressed")}
            onPressIn={() => setIsDeletePressed(true)}
            onPressOut={() => setIsDeletePressed(false)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#121212" // Black background
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
      padding:17
    },
  heading: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: "#ff4d4d" // Red heading
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
    color: "#fff" // White values
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
    borderWidth:1,
    borderColor:"#ff4d4d"
  },
  buttonText: {
    color:"#ff4d4d",
    fontWeight: "bold",
  },
  buttonPressed: {
    backgroundColor: "#ff4d4d",
  },
});

