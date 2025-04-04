import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../auth/AuthContext";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import transactionStyle from "@/styles/transactionStyle";
import { useRouter } from "expo-router";

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("dateDesc");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const router = useRouter();

  const { user } = useAuth();
  const db = getFirestore();

  const handlePress = (transaction) => {
    router.push({
      pathname: "/screens/transactionDetails",
      params: { transaction: JSON.stringify(transaction) },
    });
  };

  // Fetch Transactions
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(db, `users/${user.uid}/transactions`),
      (snapshot) => {
        const fetchedTransactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => b.date.seconds - a.date.seconds);
        setTransactions(fetchedTransactions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Sorting Transactions
  useEffect(() => {
    let sortedTransactions = [...transactions];
    if (sortOption === "dateDesc") {
      sortedTransactions.sort((a, b) => b.date.seconds - a.date.seconds);
    } else if (sortOption === "dateAsc") {
      sortedTransactions.sort((a, b) => a.date.seconds - b.date.seconds);
    } else if (sortOption === "amountDesc") {
      sortedTransactions.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === "amountAsc") {
      sortedTransactions.sort((a, b) => a.amount - b.amount);
    }
    setFilteredTransactions(sortedTransactions);
  }, [sortOption, transactions]);

  // Filtering Transactions
  useEffect(() => {
    const filterOptions = {
      All: () => transactions,
      Income: () => transactions.filter((t) => t.transactionType === "income"),
      Expenses: () => transactions.filter((t) => t.transactionType === "expense"),
      "This Month": () =>
        transactions.filter(
          (t) =>
            new Date(t.date.seconds * 1000).getMonth() === new Date().getMonth()
        ),
    };
    setFilteredTransactions(filterOptions[activeFilter]());
  }, [activeFilter, transactions]);

  const formatTimestamp = (timestamp) => {
    const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : null;
    return date ? format(date, "dd MMM yyyy, HH:mm") : "Invalid date";
  };

  // Transaction Summary
  const calculateSummary = useCallback(() => {
    const income = transactions
      .filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return { income, expenses, balance: income + expenses };
  }, [transactions]);

  const { income, expenses, balance } = calculateSummary();

  const renderTransaction = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={transactionStyle.transaction}>
      <Ionicons
        name="cart"
        size={24}
        color={item.transactionType === "income" ? "#2ecc71" : "#e74c3c"}
      />
      <View style={transactionStyle.transactionDetails}>
        <Text style={transactionStyle.transactionTitle}>{item.category}</Text>
        <Text style={transactionStyle.transactionDate}>{formatTimestamp(item.date)}</Text>
      </View>
      <Text
        style={[
          transactionStyle.transactionAmount,
          { color: item.transactionType === "income" ? "#2ecc71" : "#e74c3c" },
        ]}
      >
        ₹{item.amount}
      </Text>
    </View>
    </TouchableOpacity>
  );

  const SortingModal = () => (
    <Modal
      transparent
      animationType="fade"
      visible={sortModalVisible}
      onRequestClose={() => setSortModalVisible(false)}
    >
      <Pressable 
        style={transactionStyle.modalBackdrop} 
        onPress={() => setSortModalVisible(false)} // Close on outside press
      >
        <View style={transactionStyle.modalContent}>
          <Text style={transactionStyle.modalTitle}>Sort By</Text>
          {["Newest First (Default)", "Oldest First", "Highest Amount", "Lowest Amount"].map((label, index) => {
            const value = ["dateDesc", "dateAsc", "amountDesc", "amountAsc"][index];
            return (
              <Pressable 
                key={value} 
                style={({ pressed }) => [
                  transactionStyle.option,
                  pressed && transactionStyle.optionPressed
                ]}
                onPress={() => {
                  setSortOption(value);
                  setSortModalVisible(false);
                }}
              >
                <Text style={transactionStyle.optionText}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
  

  if (loading) {
    return (
      <View style={transactionStyle.loader}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <ScrollView style={transactionStyle.container}>
      <View style={[transactionStyle.summarySection, transactionStyle.elevatedCard]}>
        <Text style={transactionStyle.heading}>Transaction Summary</Text>
        <View style={transactionStyle.summaryRow}>
          <View style={transactionStyle.summaryBox}>
            <Text style={[transactionStyle.summaryAmount, { color: "#2ecc71" }]}>+{income.toFixed(2)}</Text>
            <Text style={transactionStyle.summaryLabel}>Income</Text>
          </View>
          <View style={transactionStyle.summaryBox}>
            <Text style={[transactionStyle.summaryAmount, { color: "#e74c3c" }]}>{expenses.toFixed(2)}</Text>
            <Text style={transactionStyle.summaryLabel}>Expenses</Text>
          </View>
          <View style={transactionStyle.summaryBox}>
            <Text style={[transactionStyle.summaryAmount, { color: balance >= 0 ? "#2ecc71" : "#e74c3c" }]}>
              {balance.toFixed(2)}
            </Text>
            <Text style={transactionStyle.summaryLabel}>Balance</Text>
          </View>
        </View>
      </View>

      <View style={[transactionStyle.section, transactionStyle.elevatedCard]}>
        <View style={transactionStyle.header}>
          <Text style={transactionStyle.heading}>
            All Transactions
            <MaterialIcons name="history" size={20} color="#e74c3c" />
          </Text>
          <TouchableOpacity onPress={() => setSortModalVisible(true)}>
            <MaterialIcons name="sort" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["All", "Income", "Expenses", "This Month"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                transactionStyle.filterButton,
                activeFilter === filter && transactionStyle.activeFilter,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={transactionStyle.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No transactions found</Text>}
        />
      </View>
      <SortingModal />
    </ScrollView>
  );
};

export default TransactionsScreen;
