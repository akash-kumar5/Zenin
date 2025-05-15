import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0d0d0d',
    paddingVertical:40 // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E4E4E4', // Light grey text for dark mode
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E4E4E4', // Light grey text for labels
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2a2a2a', // Dark grey border
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#1a1a1a', // Dark card background
    color: '#E4E4E4', // Light text color for input
  },
  otherInput: {
    borderWidth: 1,
    borderColor: '#2a2a2a', // Dark grey border
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#1a1a1a', // Dark card background
    color: '#E4E4E4', // Light text color for input
    marginTop: 10,
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  bubble: {
    backgroundColor: '#1a1a1a', // Dark card background for bubbles
    borderWidth: 1,
    borderColor: '#FF5252', // Bright red border for bubbles
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleSelected: {
    backgroundColor: '#FF5252', // Bright red background when selected
  },
  bubbleText: {
    fontSize: 14,
    color: '#E4E4E4', // Light grey text for bubble text
    marginLeft: 5,
  },
  bubbleTextSelected: {
    color: '#fff', // White text when selected
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#2a2a2a', // Dark grey border
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#1a1a1a', // Dark background for date button
  },
  dateText: {
    fontSize: 16,
    color: '#E4E4E4', // Light grey text for date
  },
  buttonContainer: {
    marginTop: 20,
  },
  otherCategory: {
    marginTop: 10,
  },
  otherPaymentMethod: {
    marginTop: 10,
  },
});

export default styles;
