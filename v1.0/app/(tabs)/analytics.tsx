import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const categoryData = {
    labels: ["Food", "Rent", "Transport", "Shopping", "Bills"],
    datasets: [
      {
        data: [1200, 3000, 800, 1500, 900],
        colors: [
          () => "#e74c3c",
          () => "#c0392b",
          () => "#d35400",
          () => "#f39c12",
          () => "#e67e22",
        ],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Spending Breakdown */}
      <View style={styles.section}>
        <Text style={styles.heading}>Spending Breakdown</Text>
        <PieChart
          data={[
            { name: "Food", amount: 500, color: "#e74c3c", legendFontColor: "#E4E4E4", legendFontSize: 12 },
            { name: "Rent", amount: 1000, color: "#3498db", legendFontColor: "#E4E4E4", legendFontSize: 12 },
            { name: "Shopping", amount: 700, color: "#f1c40f", legendFontColor: "#E4E4E4", legendFontSize: 12 },
          ]}
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
        <BarChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr"],
            datasets: [
              { data: [1200, 1500, 900, 1800], color: () => "#e74c3c" }, // Expenses
              { data: [2000, 1800, 2200, 2400], color: () => "#2ecc71" }, // Income
            ],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel="₹"
          yAxisSuffix="k"
          style={styles.chart}
        />
      </View>

      {/* Monthly Trends */}
      <View style={styles.section}>
        <Text style={styles.heading}>Monthly Trends</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr"],
            datasets: [
              { data: [500, 700, 600, 800], strokeWidth: 2, color: () => "#e74c3c" },
            ],
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
        <BarChart
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
        />
      </View>

      {/* Savings Insights */}
      <View style={styles.section}>
        <Text style={styles.heading}>Savings Insights</Text>
        <View style={styles.tip}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.tipText}>
            Set up automatic transfers to your savings account.
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.tipText}>
            Limit eating out to save more on food expenses.
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.tipText}>
            Cancel unused subscriptions to reduce monthly bills.
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.tipText}>
            Use cashback and rewards for regular purchases.
          </Text>
        </View>
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

