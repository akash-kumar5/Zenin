import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Dimensions,
} from "react-native";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const COLORS = ["#e74c3c", "#3498db", "#f1c40f"];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const balances = {
    bank: 12000.5,
    cash: 800.0,
    investments: 5000.0,
  };

  const spendingData = [
    {
      name: "Food",
      amount: 500,
      color: "#e74c3c",
      legendFontColor: "#E4E4E4",
      legendFontSize: 12,
    },
    {
      name: "Rent",
      amount: 1000,
      color: "#3498db",
      legendFontColor: "#E4E4E4",
      legendFontSize: 12,
    },
    {
      name: "Shopping",
      amount: 700,
      color: "#f1c40f",
      legendFontColor: "#E4E4E4",
      legendFontSize: 12,
    },
  ];

  const goals = [
    { name: "Save ₹5000", progress: 0.6 },
    { name: "Invest ₹2000", progress: 0.3 },
  ];

  const bills = [
    { name: "Electricity", due: "2025-03-10", status: "Pending" },
    { name: "Internet", due: "2025-03-15", status: "Paid" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting Section */}
      <View style={styles.section}>
        <Text style={styles.greeting}>
          {getGreeting()}, {"Bitch "}!
        </Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.cardTitle}>Your Balances</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Bank:</Text>
          <Text style={styles.balanceValue}>₹{balances.bank.toFixed(2)}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Cash:</Text>
          <Text style={styles.balanceValue}>₹{balances.cash.toFixed(2)}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Investments:</Text>
          <Text style={styles.balanceValue}>
            ₹{balances.investments.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.heading}>Recent Transactions</Text>
        <View style={styles.transaction}>
          <Text style={styles.transactionText}>🍕 Food Delivery</Text>
          <Text style={styles.transactionAmount}>- ₹500.00</Text>
        </View>
        <View style={styles.transaction}>
          <Text style={styles.transactionText}>🛒 Grocery Shopping</Text>
          <Text style={styles.transactionAmount}>- ₹1200.00</Text>
        </View>
        <View style={styles.transaction}>
          <Text style={styles.transactionText}>💼 Salary</Text>
          <Text style={[styles.transactionAmount, { color: "#27ae60" }]}>
            + ₹20000.00
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/transactions")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Spending Overview */}
      <View style={styles.section}>
  <Text style={styles.heading}>Spending Overview</Text>
</View>

      {/* Goals & Tips */}
      <View style={styles.section}>
        <Text style={styles.heading}>Goals & Tips</Text>
        {goals?.map((goal, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={styles.subHeading}>{goal.name}</Text>
            <Progress.Bar progress={10} width={200} color="#e74c3c" />
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.heading}>Quick Actions</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Add Income" color="#27ae60" onPress={() => {router.push("/screens/addIncome")}} />
          <Button title="Add Expense" color="#e74c3c" onPress={() => {router.push("/screens/addExpense")}} />
        </View>
      </View>

      {/* Upcoming Bills */}
      <View style={styles.section}>
        <Text style={styles.heading}>Upcoming Bills</Text>
        {bills.map((bill, index) => (
          <View key={index} style={styles.billRow}>
            <Text style={styles.subHeading}>
              {bill.name} - Due: {bill.due}
            </Text>
            <Text
              style={{ color: bill.status === "Paid" ? "#27ae60" : "#e74c3c" }}
            >
              {bill.status}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    color: Colors.dark.accent,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceCard: {
    backgroundColor: Colors.dark.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.dark.text,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  balanceLabel: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  balanceValue: {
    color: Colors.dark.accent,
    fontSize: 16,
    fontWeight: "bold",
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#595959",
  },
  transactionText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  transactionAmount: {
    color: "#e74c3c", // Red for expense
    fontSize: 16,
    fontWeight: "bold",
  },
  viewAll: {
    color: "#e74c3c",
    textAlign: "right",
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  heading: {
    color: "#e74c3c", // Red accent for headings
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subHeading: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  placeholder: {
    color: "#aaa",
    fontSize: 14,
    fontStyle: "italic",
  },
});
