import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthChoiceScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/bg2.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Pristup za profesore</Text>
        <Text style={styles.text}>Izaberite opciju:</Text>

        <Pressable
          onPress={() => router.push('/login')}
          style={({ hovered, pressed }) => [
            styles.buttonWrapper,
            hovered && { opacity: 0.9 },
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
          ]}
        >
          <LinearGradient colors={['#ff80ab', '#f06292']} style={styles.button}>
            <Text style={styles.buttonText}>Prijavi se</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 20 }} />

        <Pressable
          onPress={() => router.push('/register')}
          style={({ hovered, pressed }) => [
            styles.buttonWrapper,
            hovered && { opacity: 0.9 },
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
          ]}
        >
          <LinearGradient colors={['#f06292', '#ff80ab']} style={styles.button}>
            <Text style={styles.buttonText}>Registruj se</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18,18,18,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 30,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#fff',
  },
});
