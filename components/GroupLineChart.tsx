import React from 'react';
import { ScrollView, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const GroupedLineChart = ({ incomeData, expenseData, sortedMonthLabels }) => {
  const data = {
    labels: sortedMonthLabels,
    datasets: [
      {
        data: incomeData,
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Income - green
        strokeWidth: 2,
      },
      {
        data: expenseData,
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Expense - red
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#1e1e1e',
    backgroundGradientTo: '#1e1e1e',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <LineChart
          data={data}
          width={sortedMonthLabels.length * 60}
          height={240}
          chartConfig={chartConfig}
          bezier
          withDots
          withShadow
          verticalLabelRotation={30}
          fromZero
          formatYLabel={(val) => `₹${(val / 1000).toFixed(1)}k`}
        />
      </View>
    </ScrollView>
  );
};

export default GroupedLineChart;
