import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import styles from '../styles/analyticsStyle';
import {Icon} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const ToggleBarChart = ({incomeData, expenseData, labels}) => {
  const [activeType, setActiveType] = useState('income'); // 'income' or 'expense'

  const dataSet = activeType === 'income' ? incomeData : expenseData;
  const barColor =
    activeType === 'income' ? 'rgba(46, 204, 113, 1)' : 'rgba(231, 76, 60, 1)';

  const formattedData = dataSet.map(value => value / 1000);
  const data = {
    labels: labels,
    datasets: [
      {
        data: formattedData,
        colors: dataSet.map(() => () => barColor),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#1e1e1e',
    backgroundGradientTo: '#1e1e1e',
    decimalPlaces: 1,
    color: () => barColor,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  return (
    <View style={{flex: 1, marginVertical: 10}}>
      {/* Header and Toggle */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          style={[
            styles.heading,
            {
              color:
                activeType === 'income'
                  ? 'rgba(46, 204, 113, 1)'
                  : 'rgba(231, 76, 60, 1)',
            },
          ]}>
          {activeType === 'income' ? 'Income' : 'Expense'} Overview
        </Text>
        <TouchableOpacity
          onPress={() =>
            setActiveType(prev => (prev === 'income' ? 'expense' : 'income'))
          }>
          <Ionicons name="swap-horizontal" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={data}
            width={labels.length * 60}
            height={280}
            fromZero
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={{
              ...chartConfig,
              propsForBackgroundLines: {stroke: '#444'},
              formatYLabel: val => `${parseFloat(val).toFixed(1)}k`,
            }}
            withInnerLines={false}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            verticalLabelRotation={20}
            style={{
              marginVertical: 3,
              borderRadius: 12,
              marginLeft: 10,
            }}
            yAxisInterval={1}
          />
      </ScrollView>
    </View>
  );
};

export default ToggleBarChart;
