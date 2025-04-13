import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from "react-native";
import styles from "@/styles/indexStyle";
import { useRouter } from "expo-router";
import { useAuth } from "@/services/AuthContext";
import { fetchUserData } from "@/utils/fetchData";
import SmartHighlights from "../components/SmartHighlights";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState({ income: 0, expense: 0, balance: 0 });

  

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const { transactions, balanceData } = await fetchUserData(user.uid);
      const sortedTx = transactions.sort(
        (a, b) => b.date.seconds - a.date.seconds
      );
      setTransactions(sortedTx);
      setBalanceData(balanceData);
      
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const QuickActionButton = ({ title, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? "#e74c3c" : "transparent",
          shadowOpacity: pressed ? 0 : 0.1, // subtle shadow only when not pressed
        },
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.text, { color: pressed ? "#fff" : "#e74c3c" }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      <View style={styles.balanceCard}>
        <Text style={styles.cardTitle}>Your Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={[styles.balanceValue, { color: "#27ae60" }]}>
            ₹{balanceData.balance.toFixed(2)}
          </Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Income</Text>
          <Text style={[styles.balanceValue, { color: "#27ae60" }]}>
            ₹{balanceData.income.toFixed(2)}
          </Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel]}>Expense</Text>
          <Text style={[styles.balanceValue, { color: "#e74c3c" }]}>
            ₹{balanceData.expense.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ====== Placeholder: Smart Insights / Tips ====== */}
      {/* e.g. "You're spending 15% more on food this week", "Try saving ₹300 more to hit your monthly goal" */}
      {/* Insert here: future smart AI/tip box component */}
      <SmartHighlights  transactions={transactions}/>

      {/* ====== Placeholder: Budget Overview (Upcoming) ====== */}
      {/* e.g. Show goal tracking, bill due progress, budget progress bar */}
      {/* Insert here: BudgetCard or GoalCard */}

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.heading}>Recent Transactions</Text>
        {transactions.length > 0 ? (
          transactions.slice(0, 3).map((tx, index) => (
            <View key={index} style={styles.transaction}>
              <Text style={styles.transactionText}>
                {tx.description
                  ? `${tx.category} (${tx.description})`
                  : `${tx.category}`}
              </Text>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: tx.amount > 0 ? "#27ae60" : "#e74c3c" },
                ]}
              >
                {tx.amount > 0 ? "+" : "-"} ₹{Math.abs(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>No transactions yet.</Text>
        )}
        <TouchableOpacity onPress={() => router.push("/transactions")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.heading}>Quick Actions</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <QuickActionButton
            title="Add Income"
            onPress={() => router.push("/screens/addIncome")}
          />
          <QuickActionButton
            title="Add Expense"
            onPress={() => router.push("/screens/addExpense")}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push('/screens/textParser')}>
            <Text>Text Parser Page (testing)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
