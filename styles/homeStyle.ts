import { Colors } from '../constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  greeting: {
    fontSize: 26,
    color: Colors.dark.accent,
    fontWeight: '700',
    marginBottom: 16,
  },
  button: {
    borderWidth: 1.5,
    borderColor: '#e74c3c',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 130,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceCard: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.dark.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  balanceValue: {
    color: Colors.dark.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: '#3d3d3d',
  },
  transactionText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    color: Colors.dark.accent,
    textAlign: 'right',
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    color: Colors.dark.accent,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  subHeading: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  placeholder: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  highlightText: {
    fontSize: 15,
    color: '#ecf0f1', // subtle white tone
    marginBottom: 6,
    lineHeight: 22,
  },
  
  highlightCard: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
});


  
export default styles;