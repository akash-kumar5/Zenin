import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../services/AuthContext';
import { format } from 'date-fns';
import transactionStyle from '../../styles/transactionStyle';
import { fetchUserData } from '../../utils/fetchData';
import { useFocusEffect } from '@react-navigation/native';

const TransactionsScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('dateDesc');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();

  const handlePress = (transaction) => {
    console.log(transaction.id);
    navigation.navigate('TransactionDetails', { id: transaction.id });

  };

  const loadData = async () => {
    setRefreshing(true);
    if (!user) return;
    try {
      const { transactions } = await fetchUserData(user.uid);
     
      const sorted = transactions.sort(
        (a, b) => b.date.seconds - a.date.seconds
      );
      setTransactions(sorted);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData(); // your function to fetch data
    }, [])
  );

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    let sorted = [...transactions];
    if (sortOption === 'dateDesc')
      sorted.sort((a, b) => b.date.seconds - a.date.seconds);
    else if (sortOption === 'dateAsc')
      sorted.sort((a, b) => a.date.seconds - b.date.seconds);
    else if (sortOption === 'amountDesc')
      sorted.sort((a, b) => b.amount - a.amount);
    else if (sortOption === 'amountAsc')
      sorted.sort((a, b) => a.amount - b.amount);
    setFilteredTransactions(sorted);
  }, [sortOption, transactions]);

  useEffect(() => {
    const filterMap = {
      All: () => transactions,
      Income: () => transactions.filter((t) => t.transactionType === 'income'),
      Expenses: () =>
        transactions.filter((t) => t.transactionType === 'expense'),
      'This Month': () =>
        transactions.filter(
          (t) =>
            new Date(t.date.seconds * 1000).getMonth() ===
            new Date().getMonth()
        ),
    };
    setFilteredTransactions(filterMap[activeFilter]());
  }, [activeFilter, transactions]);

  const formatTimestamp = (timestamp) => {
    const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : null;
    return date ? format(date, 'dd MMM yyyy, HH:mm') : 'Invalid date';
  };

  const calculateSummary = useCallback(() => {
    const income = transactions
      .filter((t) => t.transactionType === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.transactionType === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { income, expenses };
  }, [transactions]);

  const { income, expenses } = calculateSummary();

  const renderTransaction = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={transactionStyle.transaction}>
        <Ionicons
          name='cart'
          size={24}
          color={item.transactionType === 'income' ? '#2ecc71' : '#e74c3c'}
        />
        <View style={transactionStyle.transactionDetails}>
          <Text style={transactionStyle.transactionTitle}>{item.category}</Text>
          <Text style={transactionStyle.transactionDate}>
            {formatTimestamp(item.date)}
          </Text>
        </View>
        <Text
          style={[
            transactionStyle.transactionAmount,
            {
              color:
                item.transactionType === 'income' ? '#2ecc71' : '#e74c3c',
            },
          ]}
        >
          ₹{item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        transactionStyle.filterButton,
        activeFilter === item && transactionStyle.activeFilter,
      ]}
      onPress={() => setActiveFilter(item)}
    >
      <Text style={transactionStyle.filterText}>{item}</Text>
    </TouchableOpacity>
  );

  const SortingModal = () => (
    <Modal
      transparent
      animationType='fade'
      visible={sortModalVisible}
      onRequestClose={() => setSortModalVisible(false)}
    >
      <Pressable
        style={transactionStyle.modalBackdrop}
        onPress={() => setSortModalVisible(false)}
      >
        <View style={transactionStyle.modalContent}>
          <Text style={transactionStyle.modalTitle}>Sort By</Text>
          {[
            'Newest First (Default)',
            'Oldest First',
            'Highest Amount',
            'Lowest Amount',
          ].map((label, index) => {
            const value = ['dateDesc', 'dateAsc', 'amountDesc', 'amountAsc'][
              index
            ];
            return (
              <Pressable
                key={value}
                style={({ pressed }) => [
                  transactionStyle.option,
                  pressed && transactionStyle.optionPressed,
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
        <ActivityIndicator size='large' color='#e74c3c' />
      </View>
    );
  }

  return (
    <View style={transactionStyle.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={loadData}
        ListHeaderComponent={
          <>
            <View
              style={[
                transactionStyle.summarySection,
                transactionStyle.elevatedCard,
              ]}
            >
              <Text style={transactionStyle.heading}>Transaction Summary</Text>
              <View style={transactionStyle.summaryRow}>
                <View style={transactionStyle.summaryBox}>
                  <Text
                    style={[
                      transactionStyle.summaryAmount,
                      { color: '#2ecc71' },
                    ]}
                  >
                    +{income.toFixed(2)}
                  </Text>
                  <Text style={transactionStyle.summaryLabel}>Income</Text>
                </View>
                <View style={transactionStyle.summaryBox}>
                  <Text
                    style={[
                      transactionStyle.summaryAmount,
                      { color: '#e74c3c' },
                    ]}
                  >
                    {expenses.toFixed(2)}
                  </Text>
                  <Text style={transactionStyle.summaryLabel}>Expenses</Text>
                </View>
              </View>
            </View>

            <View
              style={[transactionStyle.section, transactionStyle.elevatedCard]}
            >
              <View style={transactionStyle.header}>
                <Text style={transactionStyle.heading}>
                  All Transactions{' '}
                  <MaterialIcons name='history' size={20} color='#e74c3c' />
                </Text>
                <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                  <MaterialIcons name='sort' size={24} color='#e74c3c' />
                </TouchableOpacity>
              </View>

              <FlatList
                data={['All', 'Income', 'Expenses', 'This Month']}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={renderFilter}
                contentContainerStyle={{ paddingVertical: 8 }}
                style={{ maxHeight: 47 }}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No transactions found
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
      <SortingModal />
    </View>
  );
};

export default TransactionsScreen;
