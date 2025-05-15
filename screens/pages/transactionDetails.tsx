import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore'; // This only
import {useAuth} from '../../services/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../styles/transactionDetailStyle';
import { Snackbar } from 'react-native-paper';
import { fetchUserData } from '../../utils/fetchData';

export default function TransactionDetails({route, navigation}) {
  const {user} = useAuth();
  const {id} = route.params;

  const [transaction, setTransaction] = useState(null);
  const [isEditPressed, setIsEditPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  <Snackbar
  visible={snackbarVisible}
  onDismiss={() => setSnackbarVisible(false)}
  duration={3000}
  action={{
    label: 'OK',
    onPress: () => setSnackbarVisible(false),
  }}>
  {snackbarMsg}
</Snackbar>

  useEffect(() => {
    if (!id || !user?.uid) return;

    const fetchTransaction = async () => {
      try {
        const docSnap = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('transactions')
          .doc(id)
          .get();

        if (docSnap.exists) {
          const data = docSnap.data();
          setTransaction({...data, id: docSnap.id});
          setEditedAmount(data.amount.toString());
          setEditedDescription(data.description || '');
          setEditedDate(
            data.date
              ? new Date(data.date.seconds * 1000).toISOString().split('T')[0]
              : '',
          );
        } else {
          Alert.alert('Error', 'Transaction not found');
        }
      } catch (error) {
        console.error('Failed to fetch transaction:', error);
        Alert.alert('Error', 'Failed to load transaction.');
      }
    };

    fetchTransaction();
  }, [id, user]);

  const handleSaveEdit = async () => {
    try {
      const updateData = {};
      if (editedAmount) updateData.amount = parseFloat(editedAmount);
      if (editedDescription) updateData.description = editedDescription;
      if (editedDate)
        updateData.date = firestore.Timestamp.fromDate(new Date(editedDate));

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .doc(id)
        .update(updateData);

      setModalVisible(false);
      
      setTransaction(prev => ({...prev, ...updateData}));
      fetchUserData(user.uid); // Refresh user data to reflect changes
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Could not update transaction.');
    }
  };

  const confirmDelete = () => {
    Alert.alert('Confirm Deletion', 'Delete this transaction?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: handleDelete},
    ]);

  };

  const handleDelete = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('transactions')
        .doc(id)
        .delete();

        setSnackbarMsg('Transaction deleted');
        setSnackbarVisible(true);
      navigation.goBack(); // Refresh user data to reflect changes
    } catch (error) {
      console.error('Delete failed:', error);
      Alert.alert('Error', 'Could not delete transaction.');
    }
  };

  if (!transaction) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>
      <View style={styles.elevatedCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{transaction.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{transaction.amount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>
            {transaction.description || 'No description'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(transaction.date.seconds * 1000).toLocaleString()}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, isEditPressed && styles.buttonPressed]}
            onPress={() => setModalVisible(true)}
            onPressIn={() => setIsEditPressed(true)}
            onPressOut={() => setIsEditPressed(false)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isDeletePressed && styles.buttonPressed]}
            onPress={confirmDelete}
            onPressIn={() => setIsDeletePressed(true)}
            onPressOut={() => setIsDeletePressed(false)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Transaction</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new amount"
              keyboardType="numeric"
              onChangeText={setEditedAmount}
              value={editedAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new description"
              onChangeText={setEditedDescription}
              value={editedDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new date"
              onChangeText={setEditedDate}
              value={editedDate}
            />
            <View style={styles.optionBtn}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>

    
  );
  
}
