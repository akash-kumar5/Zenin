import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MotiView } from 'moti';

export default function Deals() {
  return (
    <ScrollView style={styles.container}>
      {/* Exclusive Deals */}
      <MotiView
        style={styles.section}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100 }}
      >
        <View style={styles.header}>
          <Ionicons name="flame" size={24} color="#e74c3c" style={styles.icon} />
          <Text style={styles.heading}>Exclusive Deals</Text>
        </View>
        <Text style={styles.description}>Special discounts just for you!</Text>
      </MotiView>

      {/* Top Categories */}
      <MotiView
        style={styles.section}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
      >
        <View style={styles.header}>
          <Ionicons name="grid" size={24} color="#e74c3c" style={styles.icon} />
          <Text style={styles.heading}>Top Categories</Text>
        </View>
        <Text style={styles.description}>Explore discounts on travel, shopping, and more!</Text>
      </MotiView>

      {/* Cashback Offers */}
      <MotiView
        style={styles.section}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300 }}
      >
        <View style={styles.header}>
          <Ionicons name="cash" size={24} color="#e74c3c" style={styles.icon} />
          <Text style={styles.heading}>Cashback Offers</Text>
        </View>
        <Text style={styles.description}>Earn cashback on every spend!</Text>
      </MotiView>

      {/* Best Coupons */}
      <MotiView
        style={styles.section}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 400 }}
      >
        <View style={styles.header}>
          <Ionicons name='pricetag' size={24} color='#e74c3c' style={styles.icon} />
          <Text style={styles.heading}>Best Coupons</Text>
        </View>
        <Text style={styles.description}>Apply coupons to save more!</Text>
      </MotiView>

      {/* Explore More Button */}
      <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8}>
        <Text style={styles.exploreText}>Explore More Deals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  heading: {
    color: '#e74c3c',
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },
  exploreButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  exploreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
