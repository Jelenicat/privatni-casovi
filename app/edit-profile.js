import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import { SVI_GRADOVI_SRBIJE, OPSTINE_BEOGRADA } from '../constants/serbianCities';

const KATEGORIJE_PREDMETA = {
  'Jezici': ['Engleski', 'Nemački', 'Francuski', 'Srpski jezik', 'Italijanski', 'Španski'],
  'Prirodne nauke': ['Matematika', 'Fizika', 'Hemija', 'Biologija'],
  'Računari': ['Informatika', 'Programiranje', 'Računarske mreže'],
  'Društvene nauke': ['Istorija', 'Geografija', 'Psihologija', 'Sociologija'],
  'Ekonomija i pravo': ['Ekonomija', 'Pravo', 'Menadžment'],
};

export default function EditProfile() {
  const [ime, setIme] = useState('');
  const [opis, setOpis] = useState('');
  const [trajanjeCasa, setTrajanjeCasa] = useState('45');
  const [gradovi, setGradovi] = useState({});
  const [opstine, setOpstine] = useState({});
  const [cena, setCena] = useState('');
  const [predmeti, setPredmeti] = useState({});
  const [nivoi, setNivoi] = useState({
    'Osnovna škola': false,
    'Srednja škola': false,
    Fakultet: false,
  });
  const [gradDropdownVisible, setGradDropdownVisible] = useState(false);
  const [opstinaModalVisible, setOpstinaModalVisible] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [email, setEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'profesori', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIme(data.ime || '');
          setOpis(data.opis || '');
          setTrajanjeCasa(data.trajanjeCasa || '45');
          setGradovi(data.gradovi || {});
          setOpstine(data.opstine || {});
          setPredmeti(data.predmeti || {});
          setNivoi(data.nivoi || nivoi);
          setCena(data.cena ? data.cena.toString() : '');
          setEmail(data?.email ? data.email : user.email);
        }
      }
    };
    fetchProfile();
  }, []);

 const toggleCheckbox = (stateSetter, state, key) => {
  const newState = { ...state, [key]: !state[key] };
  if (!newState[key]) {
    delete newState[key]; // briši ako nije čekirano
  }
  stateSetter(newState);
};

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const saveProfile = async () => {
   if (!ime || !opis) {
  Alert.alert('Greška', 'Molimo unesite ime i opis.');
  return;
}


    try {
      const user = auth.currentUser;
      const docRef = doc(db, 'profesori', user.uid);
      if (!email) {
  Alert.alert('Greška', 'Email nije dostupan. Prijavite se ponovo.');
  return;
}
      await updateDoc(docRef, {
        ime,
        opis,
        trajanjeCasa,
        gradovi,
        opstine,
        predmeti,
        nivoi,
        cena: parseInt(cena),
        email,
      });
      Alert.alert('Uspešno', 'Profil je sačuvan.');
      router.replace('/my-profile');
    } catch (error) {
      console.error('Greška pri ažuriranju:', error);
      Alert.alert('Greška', 'Neuspešno ažuriranje profila.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Popuni ili izmeni profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Ime i prezime"
        placeholderTextColor="#aaa"
        value={ime}
        onChangeText={setIme}
      />
      <Text style={styles.label}>O meni:</Text>
<TextInput
  style={[styles.input, { height: 100 }]}
  placeholder="Napišite nešto o sebi"
  placeholderTextColor="#aaa"
  value={opis}
  onChangeText={setOpis}
  multiline
/>


      <Text style={styles.label}>Trajanje časa:</Text>
      <View style={styles.row}>
        <Pressable onPress={() => setTrajanjeCasa('45')} style={[styles.timeButton, trajanjeCasa === '45' && styles.activeButton]}>
          <Text style={styles.timeText}>45 min</Text>
        </Pressable>
        <Pressable onPress={() => setTrajanjeCasa('60')} style={[styles.timeButton, trajanjeCasa === '60' && styles.activeButton]}>
          <Text style={styles.timeText}>60 min</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Cena časa (u dinarima):</Text>
      <TextInput
        style={styles.input}
        placeholder="npr. 1200"
        placeholderTextColor="#aaa"
        value={cena}
        onChangeText={(text) => setCena(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />
       <Text style={styles.label}>Email (ne menja se):</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#333' }]}
        value={email}
        editable={false}
      />

      <Text style={styles.label}>Gradovi:</Text>
      <Pressable onPress={() => setGradDropdownVisible(true)} style={styles.dropdownButton}>
        <Text style={styles.dropdownButtonText}>
          {Object.keys(gradovi).length > 0 ? `Izabrano: ${Object.entries(gradovi)
  .filter(([_, v]) => v)
  .map(([k, _]) => k)
  .join(', ')}` : 'Odaberi gradove'}
        </Text>
      </Pressable>

      {gradovi['Beograd'] && (

        <>
          <Text style={styles.label}>Opštine Beograda:</Text>
          <Pressable onPress={() => setOpstinaModalVisible(true)} style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>
              {Object.entries(opstine).filter(([_, v]) => v).length > 0
  ? `Izabrano: ${Object.entries(opstine)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(', ')}`
  : 'Odaberi opštine'}

            </Text>
          </Pressable>
        </>
      )}

      {/* Modal za gradove */}
      <Modal visible={gradDropdownVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Izaberi gradove</Text>
            <FlatList
              data={SVI_GRADOVI_SRBIJE}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={gradovi[item] || false}
                    onValueChange={() => toggleCheckbox(setGradovi, gradovi, item)}
                    color={gradovi[item] ? '#f06292' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </View>
              )}
            />
            <Pressable onPress={() => setGradDropdownVisible(false)} style={styles.saveButtonWrapper}>
              <LinearGradient colors={['#ff80ab', '#f06292']} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Zatvori</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal za opštine */}
      <Modal visible={opstinaModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Izaberi opštine</Text>
            <FlatList
              data={OPSTINE_BEOGRADA}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={opstine[item] || false}
                    onValueChange={() => toggleCheckbox(setOpstine, opstine, item)}
                    color={opstine[item] ? '#f06292' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </View>
              )}
            />
            <Pressable onPress={() => setOpstinaModalVisible(false)} style={styles.saveButtonWrapper}>
              <LinearGradient colors={['#ff80ab', '#f06292']} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Zatvori</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Predmeti:</Text>
      {Object.entries(KATEGORIJE_PREDMETA).map(([kategorija, lista]) => (
        <View key={kategorija} style={styles.categoryCard}>
          <Pressable onPress={() => toggleGroup(kategorija)}>
            <Text style={styles.categoryTitle}>
              {expandedGroups[kategorija] ? '▼' : '►'} {kategorija}
            </Text>
          </Pressable>
          {expandedGroups[kategorija] && (
            <View style={styles.subjectList}>
              {lista.map((predmet) => (
                <View key={predmet} style={styles.subjectItem}>
                  <Checkbox
                    value={predmeti[predmet] || false}
                    onValueChange={() => toggleCheckbox(setPredmeti, predmeti, predmet)}
                    color={predmeti[predmet] ? '#f06292' : undefined}
                  />
                  <Text style={styles.subjectLabel}>{predmet}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <Text style={styles.label}>Nivo obrazovanja:</Text>
      {Object.keys(nivoi).map((nivo) => (
        <View key={nivo} style={styles.checkboxContainer}>
          <Checkbox
            value={nivoi[nivo]}
            onValueChange={() => toggleCheckbox(setNivoi, nivoi, nivo)}
            color={nivoi[nivo] ? '#f06292' : undefined}
          />
          <Text style={styles.checkboxLabel}>{nivo}</Text>
        </View>
      ))}

      <Pressable
  onPress={saveProfile}
  style={({ hovered, pressed }) => [
    styles.saveButtonWrapper,
    hovered && { opacity: 0.9 },
    pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
  ]}
>
  <LinearGradient colors={['#ff80ab', '#f06292']} style={styles.saveButton}>
    <Text style={styles.saveButtonText}>Sačuvaj</Text>
  </LinearGradient>
</Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#fff', fontFamily: 'PoppinsBold', textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#555', borderRadius: 10,
    padding: 12, marginBottom: 15, fontSize: 16,
    backgroundColor: '#1f1f1f', color: '#fff', fontFamily: 'Poppins'
  },
  label: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 5, color: '#ccc', fontFamily: 'Poppins' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#f06292',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PoppinsBold'
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { marginLeft: 10, fontSize: 16, color: '#fff', fontFamily: 'Poppins' },
  saveButtonWrapper: { borderRadius: 12, overflow: 'hidden', marginTop: 20 },
  saveButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#fff',
  },
  dropdownButton: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
    padding: 12,
    marginBottom: 15,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'PoppinsBold',
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 17,
    fontFamily: 'PoppinsBold',
    color: '#f06292',
    marginBottom: 10,
  },
  subjectList: {
    marginLeft: 5,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Poppins',
  },
});