import { AppRegistry } from 'react-native';
import { handleMessage } from '@/utils/messageParser'; // adjust path as needed

const HeadlessNotificationTask = async (notification) => {
  console.log('Headless Notification Received', notification);
  // Assuming notification.data contains the message payload
  const msg = notification.data?.message;
  if (msg) {
    handleMessage(msg); // Call your parser
  }
};

AppRegistry.registerHeadlessTask(
  'RNPushNotificationListenerService',
  () => HeadlessNotificationTask
);


export default HeadlessNotificationTask;