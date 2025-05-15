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
import {useAuth} from '../../services/AuthContext';
import styles from '../../styles/formStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddIncome({navigation}) {
  const {user} = useAuth();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Salary',
    otherCategory: '',
    paymentMethod: 'bank',
    otherPaymentMethod: '',
    date: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    'Salary',
    'Business',
    'Investments',
    'Freelance',
    'Gift',
    'Other',
  ];
  const paymentMethods = ['bank', 'cash', 'cheque', 'online', 'other'];

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const finalCategory =
      formData.category === 'Other' && formData.otherCategory.trim()
        ? formData.otherCategory.trim()
        : formData.category;

    const finalPaymentMethod =
      formData.paymentMethod === 'other' && formData.otherPaymentMethod.trim()
        ? formData.otherPaymentMethod.trim()
        : formData.paymentMethod;

    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), {
        amount: Math.abs(parseFloat(formData.amount)),
        description: formData.description,
        category: finalCategory,
        paymentMethod: finalPaymentMethod,
        date: formData.date,
        transactionType: 'income',
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Income added successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error adding income:', error);
      Alert.alert('Error', 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Add New Income</Text>
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
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={formData.amount}
          onChangeText={text => handleChange('amount', text)}
        />
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="What was this income for?"
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
                  cat === 'Salary'
                    ? 'briefcase-outline'
                    : cat === 'Business'
                    ? 'storefront-outline'
                    : cat === 'Investments'
                    ? 'trending-up-outline'
                    : cat === 'Freelance'
                    ? 'laptop-outline'
                    : cat === 'Gift'
                    ? 'gift-outline'
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
                {cat === 'Other' && formData.otherCategory
                  ? formData.otherCategory
                  : cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {formData.category === 'Other' && (
          <TextInput
            style={styles.input}
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
                  method === 'bank'
                    ? 'business-outline'
                    : method === 'cash'
                    ? 'cash-outline'
                    : method === 'cheque'
                    ? 'document-text-outline'
                    : method === 'online'
                    ? 'wifi-outline'
                    : 'help-circle-outline'
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
                {method === 'other' && formData.otherPaymentMethod
                  ? formData.otherPaymentMethod
                  : method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {formData.paymentMethod === 'other' && (
          <TextInput
            style={styles.input}
            placeholder="Enter payment method"
            placeholderTextColor="#888"
            value={formData.otherPaymentMethod}
            onChangeText={text => handleChange('otherPaymentMethod', text)}
          />
        )}
      </View>

      {/* Date */}
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

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Adding...' : 'Add Income'}
          onPress={handleSubmit}
          disabled={loading}
          color="#d32f2f"
        />
      </View>
    </ScrollView>
  );
}
