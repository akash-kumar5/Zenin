import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/homeStyle';

const SmartHighlights = ({ transactions }) => {
  const highlights = useMemo(() => {
    if (!transactions || transactions.length === 0) return {};

    let biggestExpense = null;
    const categoryTotals = {};

    transactions.forEach((tx) => {
      const amt = tx.amount;
      const cat = tx.category;

      if (amt < 0) {
        // Track biggest negative amount (expense)
        if (!biggestExpense || amt < biggestExpense.amount) {
          biggestExpense = tx;
        }

        // Track total per category
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(amt);
      }
    });

    // Find least spent category (non-zero)
    let leastSpendingCategory = null;
    let minSpent = Infinity;
    for (const [cat, total] of Object.entries(categoryTotals)) {
      if (total < minSpent && total > 0) {
        minSpent = total;
        leastSpendingCategory = cat;
      }
    }

    return {
      biggestExpense,
      leastSpendingCategory,
    };
  }, [transactions]);

  const { biggestExpense, leastSpendingCategory } = highlights;

  if (!biggestExpense && !leastSpendingCategory) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Highlights</Text>
        <View style={styles.highlightCard}>
        {biggestExpense && (
        <Text style={styles.highlightText}>
          Biggest expense this month:{' '}
          <Text style={{ color: '#e74c3c' }}>
            {biggestExpense.category} - ₹{Math.abs(biggestExpense.amount)}
          </Text>
        </Text>
      )}
        </View>
      

      <View style={styles.highlightCard}> 
      {leastSpendingCategory && (
        <Text style={styles.highlightText}>
          Least spent on:{' '}
          <Text style={{ color: '#7f8c8d' }}>{leastSpendingCategory}</Text>
        </Text>
      )}
      </View>
      
    </View>
  );
};

export default SmartHighlights;
