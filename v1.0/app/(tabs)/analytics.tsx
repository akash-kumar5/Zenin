import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import { useAuth } from "../auth/AuthContext";
import styles from "@/styles/analyticsStyle";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryGroup,
  VictoryTheme,
  VictoryLabel,
} from "victory-native";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const processData = (transactions) => {
    const categories = {};
    const incomeByMonth = {};
    const expenseByMonth = {};
    const monthSet = new Set();
    const dateMap = {};

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
      monthSet.add(key);
      dateMap[key] = jsDate;

      const absAmount = Math.abs(parsedAmount);
      if (transactionType === "expense") {
        categories[category] = (categories[category] || 0) + absAmount;
        expenseByMonth[key] = (expenseByMonth[key] || 0) + absAmount;
      } else {
        incomeByMonth[key] = (incomeByMonth[key] || 0) + absAmount;
      }
    });

    const sortedMonths = Array.from(monthSet).sort(
      (a, b) => new Date(dateMap[a]) - new Date(dateMap[b])
    );

    const incomeArr = sortedMonths.map((month) => incomeByMonth[month] || 0);
    const expenseArr = sortedMonths.map((month) => expenseByMonth[month] || 0);
    const totalByMonth = sortedMonths.reduce((acc, m, i) => {
      acc[m] = incomeArr[i] + expenseArr[i];
      return acc;
    }, {});

    setCategoryTotals(categories);
    setMonthlyTotals(totalByMonth);
    setIncome(incomeArr);
    setExpenses(expenseArr);
  };

  const sortedMonthLabels = Object.keys(monthlyTotals).sort((a, b) => {
    return (
      new Date(`${a.split(" ")[0]} 1, ${a.split(" ")[1]}`) -
      new Date(`${b.split(" ")[0]} 1, ${b.split(" ")[1]}`)
    );
  });

  const chartConfig = {
    backgroundColor: "#121212",
    backgroundGradientFrom: "#1a1a1a",
    backgroundGradientTo: "#1a1a1a",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => "#E4E4E4",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#e74c3c",
    },
  };

  const pieColors = [
    "#e74c3c",
    "#3498db",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
    "#1abc9c",
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{ color: "#ccc", marginTop: 10 }}>
          Loading your analytics...
        </Text>
      </View>
    );
  }

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
            absolute
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
          <Text style={styles.placeholder}>
            Looks like you haven't tracked anything yet. Start saving smarter
            today!
          </Text>
        ) : (
          <ScrollView
            style={styles.chartCard}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={{ x: 30 }}
              width={screenWidth + sortedMonthLabels.length * 40}
              height={260}
              padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
              style={{ background: { fill: "#1A1A1A" } }}
            >
              <VictoryAxis
                tickFormat={sortedMonthLabels}
                style={{
                  axis: { stroke: "#444" },
                  ticks: { stroke: "#444" },
                  tickLabels: {
                    fill: "#ccc",
                    fontSize: 10,
                    angle: -20,
                    padding: 15,
                  },
                  grid: { stroke: "transparent" },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x) => `₹${x}`}
                style={{
                  axis: { stroke: "#444" },
                  tickLabels: { fill: "#ccc", fontSize: 10 },
                  grid: { stroke: "#333", strokeDasharray: "4,4" },
                }}
              />
              <VictoryGroup offset={20} colorScale={["#e74c3c", "#2ecc71"]}>
                <VictoryBar
                  data={expenses.map((y, i) => ({
                    x: sortedMonthLabels[i],
                    y,
                  }))}
                  labels={({ datum }) => `₹${datum.y}`}
                  labelComponent={
                    <VictoryLabel dy={-10} style={{ fill: "#fff", fontSize: 10 }} />
                  }
                  barWidth={18}
                />
                <VictoryBar
                  data={income.map((y, i) => ({
                    x: sortedMonthLabels[i],
                    y,
                  }))}
                  labels={({ datum }) => `₹${datum.y}`}
                  labelComponent={
                    <VictoryLabel dy={-10} style={{ fill: "#fff", fontSize: 10 }} />
                  }
                  barWidth={18}
                />
              </VictoryGroup>
            </VictoryChart>
          </ScrollView>
        )}
      </View>

      {/* Line Chart: Monthly Total Trends */}
      <View style={styles.section}>
        <Text style={styles.heading}>Monthly Trends</Text>
        {Object.keys(monthlyTotals).length === 0 ? (
          <Text style={styles.placeholder}>
            Looks like you haven't tracked anything yet. Start saving smarter
            today!
          </Text>
        ) : (
          <LineChart
            data={{
              labels: sortedMonthLabels,
              datasets: [
                {
                  data: sortedMonthLabels.map((m) => monthlyTotals[m]),
                  color: () => "#e74c3c",
                  strokeWidth: 2,
                },
                {
                  data: sortedMonthLabels.map(
                    (_, i) => income[i] - expenses[i]
                  ),
                  color: () => "#2ecc71",
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
