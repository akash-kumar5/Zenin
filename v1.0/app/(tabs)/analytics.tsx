import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { collection, getDocs, query, QuerySnapshot } from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import { useAuth } from "../auth/AuthContext";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {}
  );
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) return;

        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);

        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(data);
        processData(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    console.log(transactions);

    fetchTransactions();
  }, []);

  const processData = (transactions) => {
    let categories = {};
    let months = {};
    let incomeData = [];
    let expenseData = [];
  
    transactions.forEach(({ amount, category, type, date }) => {
      if (!amount || isNaN(amount)) return; // Avoid NaN values
  
      const month = new Date(date).toLocaleString("default", { month: "short" });
  
      months[month] = (months[month] || 0) + amount;
  
      if (type === "income") {
        incomeData.push(amount);
      } else {
        expenseData.push(amount);
        categories[category] = (categories[category] || 0) + amount; // Exclude income
      }
    });
  
    console.log("Processed Data:", categories, months, incomeData, expenseData); // Debugging
  
    setCategoryTotals(categories);
    setMonthlyTotals(months);
    setIncome(incomeData);
    setExpenses(expenseData);
  };
  

  useEffect(() => {});

  return (
    <ScrollView style={styles.container}>
      {/* Spending Breakdown */}
      <View style={styles.section}>
        <Text style={styles.heading}>Spending Breakdown</Text>
        <PieChart
          data={Object.keys(categoryTotals).map((cat, index) => ({
            name: cat,
            amount: categoryTotals[cat],
            color: ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"][
              index % 5
            ],
            legendFontColor: "#E4E4E4",
            legendFontSize: 12,
          }))}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          style={styles.chart}
        />
      </View>

      {/* Income vs Expenses */}
      <View style={styles.section}>
        <Text style={styles.heading}>Income vs Expenses</Text>
        {/* <BarChart
          data={{
            labels: Object.keys(monthlyTotals),
            datasets: [
              { data: expenses, color: () => "#e74c3c" },
              { data: income, color: () => "#2ecc71" },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel="₹"
          style={styles.chart}
        /> */}
      </View>

      {/* Monthly Trends */}
      <View style={styles.section}>
        <Text style={styles.heading}>Monthly Trends</Text>
        <LineChart
          data={{
            labels: Object.keys(monthlyTotals),
            datasets: [{ data: Object.values(monthlyTotals), strokeWidth: 2 }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Category-wise Analysis */}
      <View style={styles.section}>
        <Text style={styles.heading}>Category-wise Analysis</Text>
        {/* <BarChart
          data={categoryData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: Colors.dark.card,
            backgroundGradientFrom: Colors.dark.card,
            backgroundGradientTo: Colors.dark.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
            labelColor: () => Colors.dark.text,
          }}
          yAxisLabel="₹"
          yAxisSuffix="k"
          style={styles.chart}
        /> */}
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#121212",
  backgroundGradientFrom: "#1e1e1e",
  backgroundGradientTo: "#1e1e1e",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
  labelColor: () => "#E4E4E4",
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#e74c3c",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
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
    color: "#e74c3c",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  placeholder: {
    color: "#aaa",
    fontSize: 14,
    fontStyle: "italic",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e74c3c",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  bullet: {
    color: "#e74c3c",
    marginRight: 8,
    fontSize: 20,
  },
  tipText: {
    color: "#aaa",
    fontSize: 14,
  },
});
