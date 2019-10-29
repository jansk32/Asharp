/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Uncomment next line to disable the yellowbox
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);