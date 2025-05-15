import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useAuth} from '../../services/AuthContext';
import {fetchUserData} from '../../utils/fetchData';
import styles from '../../styles/analyticsStyle';
import PieChartComp from '../../components/PieChart';
import GroupedBarChart from '../../components/GroupBarChart';
import GroupedLineChart from '../../components/GroupLineChart';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32;

const chartConfig = {
  backgroundColor: '#121212',
  backgroundGradientFrom: '#1a1a1a',
  backgroundGradientTo: '#1a1a1a',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: () => '#E4E4E4',
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#e74c3c',
  },
};

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

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
      const {transactions} = await fetchUserData(user.uid);
      const sorted = transactions.sort(
        (a, b) => b.date.seconds - a.date.seconds,
      );
      setTransactions(sorted);
      processTransactionData(sorted);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const processTransactionData = transactions => {
    const categorySum = {};
    const incomeByMonth = {};
    const expenseByMonth = {};
    const monthDateMap = {};

    transactions.forEach(({amount, category, transactionType, date}) => {
      if (!amount || isNaN(amount)) return;

      const parsedAmount =
        typeof amount === 'string' ? parseFloat(amount) : amount;
      const jsDate = date?.seconds
        ? new Date(date.seconds * 1000)
        : new Date(date);
      const monthLabel = jsDate.toLocaleString('default', {month: 'short'});
      const key = `${monthLabel} ${jsDate.getFullYear()}`;
      monthDateMap[key] = jsDate;

      const absAmount = Math.abs(parsedAmount);
      if (transactionType === 'expense') {
        categorySum[category] = (categorySum[category] || 0) + absAmount;
        expenseByMonth[key] = (expenseByMonth[key] || 0) + absAmount;
      } else {
        incomeByMonth[key] = (incomeByMonth[key] || 0) + absAmount;
      }
    });

    const sortedMonths = Object.keys(monthDateMap).sort(
      (a, b) => new Date(monthDateMap[a]) - new Date(monthDateMap[b]),
    );

    const incomeArr = sortedMonths.map(m => incomeByMonth[m] || 0);
    const expenseArr = sortedMonths.map(m => expenseByMonth[m] || 0);
    const totalArr = sortedMonths.reduce((acc, m, i) => {
      acc[m] = incomeArr[i] + expenseArr[i];
      return acc;
    }, {});

    setCategoryTotals(categorySum);
    setIncomeData(incomeArr);
    setExpenseData(expenseArr);
    setMonthlyTotals(totalArr);
  };

  const sortedMonthLabels = useMemo(
    () =>
      Object.keys(monthlyTotals).sort(
        (a, b) =>
          new Date(`${a.split(' ')[0]} 1, ${a.split(' ')[1]}`) -
          new Date(`${b.split(' ')[0]} 1, ${b.split(' ')[1]}`),
      ),
    [monthlyTotals],
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{color: '#ccc', marginTop: 10}}>
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
      }>
      {/* Pie Chart - Spending Breakdown */}
      <PieChartComp categoryTotals={categoryTotals} />

      {/* Income vs Expenses */}
      <View style={styles.section}>
        {/* <Text style={styles.heading}>Income vs Expenses</Text> */}
        {incomeData.length === 0 && expenseData.length === 0 ? (
          <Text style={styles.placeholder}>
            Start tracking your money to see insights!
          </Text>
        ) : (
          <GroupedBarChart
            incomeData={incomeData}
            expenseData={expenseData}
            labels={sortedMonthLabels}
          />
          // <Text>bar chart</Text>
        )}
      </View>

      {/* Monthly Trends */}
      <View style={styles.section}>
        <Text style={styles.heading}>Monthly Trends</Text>
        {Object.keys(monthlyTotals).length === 0 ? (
          <Text style={styles.placeholder}>No trend data available</Text>
        ) : (
          <GroupedLineChart
            incomeData={incomeData}
            expenseData={expenseData}
            sortedMonthLabels={sortedMonthLabels}
          />
          // <Text>line chart</Text>
        )}
      </View>
    </ScrollView>
  );
}
