import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Dobrodošli</Text>
          <Text style={styles.subtitle}>
            Pronađi profesora za privatne časove
          </Text>
        </View>

        <View style={styles.buttonsWrapper}>
          <Pressable
            onPress={() => router.push('/education')}
            style={({ hovered, pressed }) => [
              styles.buttonContainer,
              hovered && { opacity: 0.9 },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
            ]}
          >
            <LinearGradient colors={['#ff80ab', '#f06292']} style={styles.button}>
              <Text style={styles.buttonText}>Pretraži profesore (učenik)</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push('/auth-choice')}
            style={({ hovered, pressed }) => [
              styles.buttonContainer,
              hovered && { opacity: 0.9 },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
            ]}
          >
            <LinearGradient colors={['#ec407a', '#d81b60']} style={styles.button}>
              <Text style={styles.buttonText}>Prijava profesora</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    margin: 20,
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  buttonsWrapper: {
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
