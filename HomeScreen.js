import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

console.log("Ucitan je pravi HomeScreen!");

export default function HomeScreen() {
  const handleSearchPress = () => {
    Alert.alert("Pretraga profesora", "Ova funkcionalnost će biti dostupna uskoro.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dobrodošli u aplikaciju za privatne časove!</Text>
      <Text style={styles.text}>
        Ova aplikacija pomaže osnovcima, srednjoškolcima i studentima da pronađu profesore, pregledaju slobodne termine i zakažu časove brzo i lako.
      </Text>
      <Text style={styles.text}>
        Klikni na dugme ispod kako bi započeo/la pretragu profesora.
      </Text>
      <Button title="Pretraži profesore" onPress={handleSearchPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});