import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/analyticsStyle';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32;

const pieColors = [
  '#e74c3c',
  '#3498db',
  '#f1c40f',
  '#2ecc71',
  '#9b59b6',
  '#1abc9c',
];

export default function PieChartComp({ categoryTotals }) {
  const totalSpending = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  const data = Object.entries(categoryTotals).map(([category, amount], i) => ({
    name: category,
    amount: amount,
    color: pieColors[i % pieColors.length],
    legendFontColor: '#ccc',
    legendFontSize: 13,
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Spending Breakdown</Text>

      {totalSpending === 0 ? (
        <Text style={styles.placeholder}>No data to display</Text>
      ) : (
        <>
          <View style={styles.centerLabel}>
            <Text style={styles.centerAmount}>{`₹${totalSpending}`}</Text>
            <Text style={styles.centerText}>Total Spent</Text>
          </View>

          <PieChart
            data={data}
            width={chartWidth}
            height={200}
            chartConfig={{
              color: () => '#fff',
              backgroundColor: 'transparent',
              backgroundGradientFrom: '#1e1e1e',
              backgroundGradientTo: '#1e1e1e',
              decimalPlaces: 0,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={false}
            absolute
          />

          <View style={styles.legendContainer}>
            {data.map((item, i) => (
              <View key={item.name} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  {item.name} - ₹{item.amount}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
