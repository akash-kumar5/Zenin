import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@react-native-firebase/auth'; // <-- you need this for user.uid
import { isFinancialMessage, parseMessage, saveParsedTransaction } from '../utils/messageParser';

const NotificationHandler = async (data) => {
  console.log('Headless JS Task Received:', data);

  try {
    const msg = data.text;
    const title = data.title || 'Notification Title'; // Fallback title if not provided
    if (!msg) {
      console.log('No text found in notification');
      return;
    }

    if (isFinancialMessage(title)) {
      console.log('This is a financial message');

      const parsed = parseMessage(msg);
      console.log('Parsed:', parsed);

      if (!parsed) {
        console.log('⚠️ Failed to parse message');
        return;
      }

      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        await saveParsedTransaction(currentUser.uid, parsed);
        console.log('Parsed and saved to Firestore!');
      } else {
        console.log('User not logged in, cannot save transaction');
      }
    }

    // Always save the raw notification locally
    await AsyncStorage.setItem('lastNotification', JSON.stringify(data));
  } catch (error) {
    console.error('NotificationHandler error:', error);
  }
};

export default NotificationHandler;
