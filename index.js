/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationHandler from './services/NotificationHandler';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('NotificationHandler', () => NotificationHandler);
