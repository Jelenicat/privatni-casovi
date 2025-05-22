import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SVI_GRADOVI_SRBIJE, OPSTINE_BEOGRADA } from '../constants/serbianCities';

export default function LocationScreen() {
  const router = useRouter();
  const { nivo } = useLocalSearchParams();

  const [grad, setGrad] = useState('');
  const [opstina, setOpstina] = useState('');

  const handleNext = () => {
    let finalOpstine = {};

    if (grad === 'Beograd') {
      if (!opstina) {
        OPSTINE_BEOGRADA.forEach((o) => (finalOpstine[o] = true));
      } else {
        finalOpstine[opstina] = true;
      }
    }

    const gradovi = { [grad]: true };

    router.push({
      pathname: '/search-filter',
      params: {
        nivo,
        gradovi: JSON.stringify(gradovi),
        opstine: JSON.stringify(finalOpstine),
      },
    });
  };

  return (
    <ImageBackground source={require('../assets/bg5.jpg')} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.overlay}>
              <Text style={styles.title}>Izaberi grad</Text>

              <RNPickerSelect
                placeholder={{ label: 'Odaberi grad...', value: null }}
                onValueChange={(value) => {
                  setGrad(value);
                  setOpstina('');
                }}
                items={SVI_GRADOVI_SRBIJE.map((g) => ({ label: g, value: g }))}
                style={{ ...pickerStyles, iconContainer: { top: 14, right: 12 } }}
                value={grad}
                useNativeAndroidPickerStyle={false}
                Icon={() => <Ionicons name="chevron-down" size={20} color="white" />}
              />

              {grad === 'Beograd' && (
                <>
                  <Text style={styles.label}>Izaberi opštinu (opciono)</Text>
                  <RNPickerSelect
                    placeholder={{ label: 'Sve opštine', value: '' }}
                    onValueChange={(value) => setOpstina(value)}
                    items={OPSTINE_BEOGRADA.map((o) => ({ label: o, value: o }))}
                    style={{ ...pickerStyles, iconContainer: { top: 14, right: 12 } }}
                    value={opstina}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <Ionicons name="chevron-down" size={20} color="white" />}
                  />
                </>
              )}

              <Pressable
                onPress={handleNext}
                disabled={!grad}
                style={({ hovered, pressed }) => [
                  styles.buttonContainer,
                  hovered && { opacity: 0.9 },
                  pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
                ]}
              >
                <LinearGradient
                  colors={grad ? ['#ff80ab', '#f06292'] : ['#555', '#555']}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Dalje</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </ScrollView>
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
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  buttonContainer: {
    marginTop: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'PoppinsBold',
    fontSize: 16,
    color: '#fff',
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#1f1f1f',
    fontFamily: 'Poppins',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#1f1f1f',
    fontFamily: 'Poppins',
    marginBottom: 10,
  },
  placeholder: {
    color: '#888',
  },
};