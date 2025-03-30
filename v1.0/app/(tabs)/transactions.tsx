import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function TransactionsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Summary Section */}
      <View style={[styles.summarySection, styles.elevatedCard]}>
        <Text style={styles.heading}>Transaction Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryAmount}>₹12,000</Text>
            <Text style={styles.summaryLabel}>Income</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={[styles.summaryAmount, { color: "#e74c3c" }]}>
              ₹8,000
            </Text>
            <Text style={styles.summaryLabel}>Expenses</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryAmount}>₹4,000</Text>
            <Text style={styles.summaryLabel}>Balance</Text>
          </View>
        </View>
      </View>

      {/* Filter Options */}
      <View style={[styles.section, styles.elevatedCard]}>
        <View style={styles.header}>
          <Text style={styles.heading}>Filter Transactions</Text>
          <Ionicons name="filter" size={20} color="#e74c3c" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.filterButton, styles.elevatedCard]}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.elevatedCard]}>
            <Text style={styles.filterText}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.elevatedCard]}>
            <Text style={styles.filterText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.elevatedCard]}>
            <Text style={styles.filterText}>This Month</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Recent Transactions */}
      <View style={[styles.section, styles.elevatedCard]}>
        <View style={styles.header}>
          <Text style={styles.heading}>Recent Transactions</Text>
          <MaterialIcons name="history" size={20} color="#e74c3c" />
        </View>

        {/* Sample Transactions */}
        <View style={styles.transaction}>
          <Ionicons name="cart" size={24} color="#e74c3c" />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Groceries</Text>
            <Text style={styles.transactionDate}>02 Mar 2025</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: "#e74c3c" }]}>
            - ₹1,200
          </Text>
        </View>

        <View style={styles.transaction}>
          <Ionicons name="cash" size={24} color="#2ecc71" />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Salary</Text>
            <Text style={styles.transactionDate}>01 Mar 2025</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: "#2ecc71" }]}>
            + ₹15,000
          </Text>
        </View>

        <TouchableOpacity style={[styles.viewAllButton, styles.elevatedCard]}>
          <Text style={styles.viewAllText}>View All Transactions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  elevatedCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6, // For Android
  },
  summarySection: {
    marginBottom: 24,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  summaryBox: {
    alignItems: "center",
  },
  summaryAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  summaryLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    color: "#e74c3c",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionDate: {
    color: "#aaa",
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  viewAllButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  viewAllText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
