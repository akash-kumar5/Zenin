import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import SmartHighlights from '../../components/SmartHighlights';
import styles from '../../styles/homeStyle';
import QuickActionButton from '../../components/QuickActionBtn';
import { fetchUserData } from '../../utils/fetchData';
import { useAuth } from '../../services/AuthContext';

export default function HomeScreen({navigation}) {
  const {user} = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState({income: 0, expense: 0});

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const {transactions, balanceData} = await fetchUserData(user.uid);
      const sortedTx = transactions.sort(
        (a, b) => b.date.seconds - a.date.seconds,
      );
      setTransactions(sortedTx);
      setBalanceData(balanceData);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }>
      <View style={styles.balanceCard}>
        <Text style={styles.cardTitle}>Your Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Income</Text>
          <Text style={[styles.balanceValue, {color: '#27ae60'}]}>
            ₹{balanceData.income.toFixed(2)}
          </Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel]}>Expense</Text>
          <Text style={[styles.balanceValue, {color: '#e74c3c'}]}>
            ₹{balanceData.expense.toFixed(2)}
          </Text>
        </View>
      </View>
      <SmartHighlights transactions={transactions} />

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
                  {
                    color:
                      tx.transactionType == 'income' ? '#27ae60' : '#e74c3c',
                  },
                ]}>
                {tx.transactionType == 'income' ? '+' : '-'} ₹
                {Math.abs(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>No transactions yet.</Text>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.heading}>Quick Actions</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <QuickActionButton
            title="Add Income"
            onPress={() => navigation.navigate('AddIncome')}
            
          />
          <QuickActionButton
            title="Add Expense"
            onPress={() => navigation.navigate('AddExpense')}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
        </View>
      </View>
    </ScrollView>
  );
}
