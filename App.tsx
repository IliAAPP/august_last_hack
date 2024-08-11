import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import Navigation from './navigation/Navigation';
import { AuthProvider } from './providers/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Navigation/>
    </AuthProvider>
  );
}

LogBox.ignoreAllLogs()