import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import { useAuth } from "../auth/AuthContext";
import styles from "@/styles/analyticsStyle";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const fetchTransactions = async () => {
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);
      processData(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const processData = (transactions) => {
    const categories = {};
    const incomeByMonth = {};
    const expenseByMonth = {};
    const allMonths = new Set();

    transactions.forEach(({ amount, category, transactionType, date }) => {
      if (!amount || isNaN(amount)) return;

      const parsedAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

      const jsDate = date?.seconds
        ? new Date(date.seconds * 1000)
        : new Date(date);
      const monthStr = jsDate.toLocaleString("default", { month: "short" });
      const year = jsDate.getFullYear();
      const key = `${monthStr} ${year}`;
      allMonths.add(key);

      const absAmount = Math.abs(parsedAmount);
      if (transactionType === "expense") {
        categories[category] = (categories[category] || 0) + absAmount;
        expenseByMonth[key] = (expenseByMonth[key] || 0) + absAmount;
      } else {
        incomeByMonth[key] = (incomeByMonth[key] || 0) + absAmount;
      }
    });

    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const [ma, ya] = a.split(" ");
      const [mb, yb] = b.split(" ");
      const dateA = new Date(`${ma} 1, ${ya}`);
      const dateB = new Date(`${mb} 1, ${yb}`);
      return dateA - dateB;
    });

    const totalByMonth = {};
    sortedMonths.forEach((m) => {
      totalByMonth[m] =
        (incomeByMonth[m] || 0) + (expenseByMonth[m] || 0);
    });

    setCategoryTotals(categories);
    setMonthlyTotals(totalByMonth);
    setIncome(sortedMonths.map((m) => incomeByMonth[m] || 0));
    setExpenses(sortedMonths.map((m) => expenseByMonth[m] || 0));
  };

  const sortedMonthLabels = Object.keys(monthlyTotals).sort((a, b) => {
    const [ma, ya] = a.split(" ");
    const [mb, yb] = b.split(" ");
    return new Date(`${ma} 1, ${ya}`) - new Date(`${mb} 1, ${yb}`);
  });

  const chartConfig = {
    backgroundColor: "#121212",
    backgroundGradientFrom: "#1e1e1e",
    backgroundGradientTo: "#1e1e1e",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => "#E4E4E4",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#e74c3c",
    },
  };

  const pieColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6", "#1abc9c"];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Pie Chart: Spending Breakdown */}
      <View style={styles.section}>
        <Text style={styles.heading}>Spending Breakdown</Text>
        {Object.keys(categoryTotals).length === 0 ? (
          <Text style={styles.placeholder}>No data to display</Text>
        ) : (
          <PieChart
            data={Object.entries(categoryTotals).map(([cat, amount], i) => ({
              name: cat,
              amount,
              color: pieColors[i % pieColors.length],
              legendFontColor: "#E4E4E4",
              legendFontSize: 12,
            }))}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        )}
      </View>

      {/* Bar Chart: Income vs Expenses */}
      <View style={styles.section}>
        <Text style={styles.heading}>Income vs Expenses</Text>
        {income.length === 0 && expenses.length === 0 ? (
          <Text style={styles.placeholder}>No data to display</Text>
        ) : (
          <BarChart
            data={{
              labels: sortedMonthLabels,
              datasets: [
                {
                  data: expenses,
                  color: () => "#e74c3c",
                },
                {
                  data: income,
                  color: () => "#2ecc71",
                },
              ],
            }}
            width={screenWidth - 32}
            height={240}
            yAxisLabel="₹"
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.5,
            }}
            style={styles.chart}
            fromZero
            withInnerLines
            showBarTops
          />
        )}
      </View>

      {/* Line Chart: Monthly Total Trends */}
      <View style={styles.section}>
        <Text style={styles.heading}>Monthly Trends</Text>
        {Object.keys(monthlyTotals).length === 0 ? (
          <Text style={styles.placeholder}>No data to display</Text>
        ) : (
          <LineChart
            data={{
              labels: sortedMonthLabels,
              datasets: [
                {
                  data: sortedMonthLabels.map((m) => monthlyTotals[m]),
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
      </View>
    </ScrollView>
  );
}
