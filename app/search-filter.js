import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const KATEGORIJE_PREDMETA = {
  'Jezici': [
    'Engleski', 'Nemački', 'Francuski', 'Srpski jezik', 'Italijanski', 'Španski',
    'Ruski', 'Kineski', 'Japanski', 'Latinski', 'Grčki'
  ],
  'Prirodne nauke': [
    'Matematika', 'Matematika 2', 'Fizika', 'Fizika 2', 'Hemija', 'Biologija',
    'Statistika', 'Astronomija', 'Geologija'
  ],
  'Računari i tehnologija': [
    'Informatika', 'Programiranje', 'Računarske mreže', 'Elektrotehnika',
    'Algoritmi', 'Baze podataka', 'Veštačka inteligencija', 'Kompjuterska grafika',
    'Bezbednost informacionih sistema'
  ],
  'Društvene nauke': [
    'Istorija', 'Geografija', 'Psihologija', 'Sociologija', 'Filozofija', 'Logika',
    'Antropologija', 'Politika', 'Etika'
  ],
  'Ekonomija i pravo': [
    'Pravo', 'Ekonomija', 'Menadžment', 'Marketing', 'Računovodstvo', 'Finansije',
    'Preduzetništvo', 'Poreski sistem', 'Bankarstvo'
  ],
  'Ostalo': [
    'Likovno', 'Likovna kultura', 'Muzika', 'Mašinstvo', 'Hemijsko inženjerstvo',
    'Biotehnologija', 'Medicinska hemija', 'Farmakologija', 'Statistika za psihologe',
    'Sport i fizičko', 'Zdravstvena nega', 'Pedagogija'
  ]
};

export default function SearchFilter() {
  const router = useRouter();
  const { nivo, gradovi, opstine } = useLocalSearchParams();
  const [predmeti, setPredmeti] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggle = (key) => {
    setPredmeti({ ...predmeti, [key]: !predmeti[key] });
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSearch = () => {
    router.push({
      pathname: '/SearchScreen',
      params: {
        nivo,
        gradovi,
        opstine,
        predmeti: JSON.stringify(predmeti),
      },
    });
  };

  return (
    <ImageBackground source={require('../assets/bg6.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Izaberi predmete</Text>

        {Object.entries(KATEGORIJE_PREDMETA).map(([kategorija, lista]) => (
          <View key={kategorija} style={styles.kategorijaBlok}>
            <Pressable onPress={() => toggleGroup(kategorija)} style={styles.kategorijaNaslovWrapper}>
              <Text style={styles.kategorijaNaslov}>
                {expandedGroups[kategorija] ? '▼' : '►'} {kategorija}
              </Text>
            </Pressable>
            {expandedGroups[kategorija] && lista.map((p) => (
              <View key={p} style={styles.checkboxContainer}>
                <Checkbox
                  value={predmeti[p] || false}
                  onValueChange={() => toggle(p)}
                  color={predmeti[p] ? '#f06292' : undefined}
                />
                <Text style={styles.label}>{p}</Text>
              </View>
            ))}
          </View>
        ))}

        <Pressable onPress={handleSearch} disabled={Object.keys(predmeti).length === 0} style={styles.buttonWrapper}>
          <LinearGradient
            colors={
              Object.values(predmeti).some((v) => v)
                ? ['#ff80ab', '#f06292']
                : ['#444', '#444']
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Pretraži profesore</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
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
    padding: 20,
    backgroundColor: 'rgba(18,18,18,0.9)',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  kategorijaBlok: {
    marginBottom: 24,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 10,
  },
  kategorijaNaslovWrapper: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  kategorijaNaslov: {
    fontSize: 18,
    color: '#ff80ab',
    fontFamily: 'PoppinsBold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#fff',
  },
  buttonWrapper: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'PoppinsBold',
    color: '#fff',
    fontSize: 16,
  },
});
