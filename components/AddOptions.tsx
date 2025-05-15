import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddOptions() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Add Transaction</Text>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="remove-circle-outline" size={24} color="#ff4d4d" />
          <Text style={styles.optionText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="add-circle-outline" size={24} color="#00cc66" />
          <Text style={styles.optionText}>Add Income</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});
