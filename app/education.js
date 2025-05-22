import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function EducationScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const handleNext = () => {
    if (selected) {
      router.push({ pathname: '/location', params: { nivo: selected } });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg1.jpg')} // ↩️ OVO JE TVOJA SLIKA
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Izaberi nivo obrazovanja</Text>

        {['Osnovna škola', 'Srednja škola', 'Fakultet'].map((nivo) => (
          <Pressable
            key={nivo}
            onPress={() => setSelected(nivo)}
            style={[
              styles.option,
              selected === nivo && styles.selectedOption,
            ]}
          >
            <Text style={styles.optionText}>{nivo}</Text>
          </Pressable>
        ))}

        <Pressable onPress={handleNext} disabled={!selected} style={styles.nextButton}>
          <LinearGradient
            colors={selected ? ['#ff80ab', '#f06292'] : ['#555', '#555']}
            style={styles.gradient}
          >
            <Text style={styles.nextButtonText}>Dalje</Text>
          </LinearGradient>
        </Pressable>
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
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.85)', // proziran crni sloj
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  option: {
    padding: 15,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#333',
  },
  selectedOption: {
    borderColor: '#ff69b4',
    backgroundColor: '#2A2A2A',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#fff',
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#fff',
  },
});
