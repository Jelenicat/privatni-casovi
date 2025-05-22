import { Platform } from 'react-native';

let AppEntry;

if (Platform.OS === 'web') {
  AppEntry = require('./WebApp').default; // web verzija (PWA)
} else {
  AppEntry = require('expo-router/entry'); // mobilna verzija
}

export default AppEntry;
