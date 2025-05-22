import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Greška', 'Unesite email i lozinku.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Uspešno', 'Ulogovani ste kao profesor');
      router.replace('/my-profile');
    } catch (error) {
      Alert.alert('Greška', 'Neispravan email ili lozinka');
    }
  };

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Prijava profesora</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Lozinka"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Text style={{ fontSize: 18, color: '#aaa' }}>
                  {showPassword ? '🚫' : '👁'}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
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

            <Text style={styles.link} onPress={() => router.push('/register')}>
              Nemate nalog? <Text style={styles.linkText}>Registrujte se</Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18,18,18,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1f1f1f',
    fontFamily: 'Poppins',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1f1f1f',
    fontFamily: 'Poppins',
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
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
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#ccc',
    fontFamily: 'Poppins',
  },
  linkText: {
    color: '#ff80ab',
    fontFamily: 'PoppinsBold',
  },
});
