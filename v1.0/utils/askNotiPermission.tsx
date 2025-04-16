import { requestPermission, getPermissionStatus} from 'react-native-android-notification-listener';
import { Linking } from 'react-native';

const askNotificationPermission = async () => {
  const hasPermission = await getPermissionStatus();

  if (!hasPermission) {
    const granted = await requestPermission();
    if (!granted) {
      // Fallback if user cancels prompt
      Linking.openSettings(); // Opens notification listener settings
    }
  }
};

export default askNotificationPermission;
