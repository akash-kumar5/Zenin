import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function BalanceCard({ balance, lastUpdated, onRefresh }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Total Balance</Text>
      <Text style={styles.balance}>₹{balance.toFixed(2)}</Text>
      <Text style={styles.updated}>Last Updated: {lastUpdated}</Text>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
        <Ionicons name="refresh" size={20} color={Colors.dark.text} />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 5,
  },
  balance: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.dark.accent,
    marginBottom: 10,
  },
  updated: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  refreshText: {
    marginLeft: 5,
    color: Colors.dark.text,
  },
});
