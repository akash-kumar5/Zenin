import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '../../utils/firebaseConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../styles/formStyle';
import uuid from 'react-native-uuid';
import {useAuth} from '../../services/AuthContext';

export default function AddExpense({navigation}) {
  console.log('AddExpense screen loaded');

  const {user} = useAuth();
  const uniqueId = uuid.v4();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    paymentMethod: 'cash',
    otherPaymentMethod: '',
    otherCategory: '',
    accountId: '',
    date: new Date(),
    imageUrl: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Other',
  ];
  const paymentMethods = ['cash', 'credit', 'debit', 'transfer', 'other'];

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async () => {
    if (!user || !user.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (
      formData.paymentMethod === 'other' &&
      !formData.otherPaymentMethod.trim()
    ) {
      Alert.alert('Error', 'Please enter a valid payment method');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), {
        amount: -Math.abs(parseFloat(formData.amount)),
        description: formData.description,
        category:
          formData.category === 'Other' && formData.otherCategory
            ? formData.otherCategory
            : formData.category,
        paymentMethod:
          formData.paymentMethod === 'other'
            ? formData.otherPaymentMethod.trim()
            : formData.paymentMethod,
        accountId: formData.accountId,
        date: formData.date,
        transactionType: 'expense',
        imageUrl: formData.imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Expense added successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add New Expense</Text>
        <View
          style={{
            height: 2,
            backgroundColor: '#ff4d4d',
            marginBottom: 10,
            width: 160,
          }}
        />

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="00.00"
            keyboardType="numeric"
            placeholderTextColor="#888"
            value={formData.amount}
            onChangeText={text => handleChange('amount', text)}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What was this expense for?"
            placeholderTextColor="#888"
            value={formData.description}
            onChangeText={text => handleChange('description', text)}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.bubbleContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.bubble,
                  formData.category === cat && styles.bubbleSelected,
                ]}
                onPress={() => handleChange('category', cat)}>
                <Ionicons
                  name={
                    cat === 'Food'
                      ? 'fast-food'
                      : cat === 'Transportation'
                      ? 'car'
                      : cat === 'Entertainment'
                      ? 'game-controller'
                      : cat === 'Utilities'
                      ? 'flash'
                      : cat === 'Shopping'
                      ? 'cart'
                      : cat === 'Healthcare'
                      ? 'medkit'
                      : 'ellipsis-horizontal-circle-outline'
                  }
                  size={20}
                  color={formData.category === cat ? '#fff' : '#ff4d4d'}
                />
                <Text
                  style={[
                    styles.bubbleText,
                    formData.category === cat && styles.bubbleTextSelected,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formData.category === 'Other' && (
            <TextInput
              style={styles.otherInput}
              placeholder="Enter category"
              placeholderTextColor="#888"
              value={formData.otherCategory}
              onChangeText={text => handleChange('otherCategory', text)}
            />
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.bubbleContainer}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.bubble,
                  formData.paymentMethod === method && styles.bubbleSelected,
                ]}
                onPress={() => handleChange('paymentMethod', method)}>
                <Ionicons
                  name={
                    method === 'cash'
                      ? 'cash'
                      : method === 'credit'
                      ? 'card'
                      : method === 'debit'
                      ? 'card-outline'
                      : method === 'transfer'
                      ? 'swap-horizontal'
                      : 'ellipsis-horizontal-circle-outline'
                  }
                  size={20}
                  color={formData.paymentMethod === method ? '#fff' : '#ff4d4d'}
                />
                <Text
                  style={[
                    styles.bubbleText,
                    formData.paymentMethod === method &&
                      styles.bubbleTextSelected,
                  ]}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formData.paymentMethod === 'other' && (
            <TextInput
              style={styles.otherInput}
              placeholder="Enter payment method"
              placeholderTextColor="#888"
              value={formData.otherPaymentMethod}
              onChangeText={text => handleChange('otherPaymentMethod', text)}
            />
          )}
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}>
            <Text style={styles.dateText}>
              {formData.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (event.type !== 'dismissed') {
                  handleChange('date', selectedDate || formData.date);
                }
              }}
            />
          )}
        </View>
        {/* Submit */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Adding...' : 'Add Expense'}
            onPress={handleSubmit}
            disabled={loading}
            color="#d32f2f"
          />
        </View>
      </ScrollView>
  );
}
