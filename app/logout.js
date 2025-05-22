// app/logout.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth); // Firebase sign out
        await AsyncStorage.removeItem('professorProfile'); // lokalno čisti
        router.replace('/login'); // preusmeri na login
      } catch (error) {
        console.error('Greška pri odjavi:', error);
        router.replace('/login'); // fallback
      }
    };

    doLogout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Odjavljujemo vas...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 20, fontSize: 16 },
});
