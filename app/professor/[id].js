import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Alert,
  TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, getDocs, deleteDoc, setDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Calendar } from 'react-native-calendars';

export default function ProfessorProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [professor, setProfessor] = useState(null);
  const [slots, setSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefonUcenika, setTelefonUcenika] = useState('');
  const [ocena, setOcena] = useState('');
  const [komentar, setKomentar] = useState('');
  const [mozeOceniti, setMozeOceniti] = useState(false);
  const [oceneKomentari, setOceneKomentari] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'profesori', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setProfessor(snap.data());

      const terminiRef = collection(db, 'profesori', id, 'slobodniTermini');
      const terminiSnap = await getDocs(terminiRef);
      let svi = {};
      terminiSnap.forEach((d) => {
        const dan = d.id;
        const vremena = d.data().vreme || [];
        svi[dan] = vremena;
      });
      setSlots(svi);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const proveriPravo = async () => {
      if (!email) return;
      const q = query(
        collection(db, 'rezervacije'),
        where('profesorId', '==', id),
        where('email', '==', email)
      );
      const snapshot = await getDocs(q);
      setMozeOceniti(!snapshot.empty);
    };
    proveriPravo();
  }, [email]);

  useEffect(() => {
    const fetchKomentari = async () => {
      const q = collection(db, 'profesori', id, 'oceneKomentari');
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => doc.data());
      setOceneKomentari(lista);
    };
    fetchKomentari();
  }, [id]);

  const zakaziCas = async () => {
    if (!selectedSlot || !ime || !prezime || !email || !telefonUcenika) {
      Alert.alert('Greška', 'Molimo popunite sva polja i izaberite termin.');
      return;
    }

    const selectedDateTime = new Date(`${selectedSlot.dan}T${selectedSlot.vreme}`);
    const now = new Date();
    if (selectedDateTime < now) {
      Alert.alert('Greška', 'Ne možete zakazati čas u prošlosti.');
      return;
    }

    try {
      const rezId = `${id}_${selectedSlot.dan}_${selectedSlot.vreme}`;
      await setDoc(doc(db, 'rezervacije', rezId), {
        profesorId: id,
        datum: selectedSlot.dan,
        vreme: selectedSlot.vreme,
        ime,
        prezime,
        email,
        telefonUcenika,
      });

      const terminRef = doc(db, 'profesori', id, 'slobodniTermini', selectedSlot.dan);
      const snap = await getDoc(terminRef);
      if (snap.exists()) {
        const updated = snap.data().vreme.filter((v) => v !== selectedSlot.vreme);
        if (updated.length > 0) {
          await setDoc(terminRef, { vreme: updated });
        } else {
          await deleteDoc(terminRef);
        }
      }
      if (!professor?.email) {
  Alert.alert('Greška', 'Profesor nema unet email u svom profilu.');
  return;
}


     await fetch('https://email-api-vert-beta.vercel.app/api/sendEmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ime,
    prezime,
    email,
    datum: selectedSlot.dan,
    vreme: selectedSlot.vreme,
    telefonUcenika,
    profesorEmail: professor.email,
  }),
});

      Alert.alert('Uspešno', 'Rezervacija je zabeležena i mejl je poslat!');
      router.replace('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Greška', 'Nešto nije uspelo.');
    }
  };

  const posaljiKomentar = async () => {
    if (!ocena || !komentar || !email) {
      Alert.alert('Greška', 'Unesite i komentar i ocenu.');
      return;
    }

    const q = query(
      collection(db, 'profesori', id, 'oceneKomentari'),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      Alert.alert('Već ste ocenili ovog profesora.');
      return;
    }

    await addDoc(collection(db, 'profesori', id, 'oceneKomentari'), {
      email,
      komentar,
      ocena: parseInt(ocena),
      timestamp: new Date(),
    });

    Alert.alert('Uspešno', 'Hvala na oceni i komentaru!');
    setKomentar('');
    setOcena('');
  };

  if (!professor) return <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>Učitavanje...</Text>;

  const markedDates = {};
  Object.keys(slots).forEach((dan) => {
    markedDates[dan] = {
      marked: true,
      dotColor: '#ff69b4',
      selected: selectedDate === dan,
      selectedColor: selectedDate === dan ? '#ff69b4' : undefined,
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.name}>{professor.ime || 'Ime nepoznato'}</Text>
          <Text style={styles.infoText}>📚 {Object.entries(professor.predmeti || {}).filter(([, v]) => v).map(([k]) => k).join(', ')}</Text>
          <Text style={styles.infoText}>🎓 {Object.entries(professor.nivoi || {}).filter(([, v]) => v).map(([k]) => k).join(', ')}</Text>
          <Text style={styles.infoText}>📍 {Object.entries(professor.gradovi || {}).filter(([, v]) => v).map(([k]) => k).join(', ')}</Text>
          <Text style={styles.infoText}>💰 {professor.cena ? `${professor.cena} RSD` : 'Nije navedena'}</Text>
          {professor.opis ? (
  <>
    <Text style={styles.section}>🧾 O profesoru</Text>
    <Text style={styles.infoText}>{professor.opis}</Text>
  </>
) : null}

          <Text style={styles.infoText}>⭐ Prosečna ocena: {professor.prosecnaOcena || 'N/A'}</Text>

          <Text style={styles.section}>📅 Dostupni termini</Text>
          <Calendar
            markedDates={{
              ...markedDates,
              ...(selectedDate ? {
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: '#ff69b4'
                }
              } : {})
            }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              calendarBackground: '#1f1f1f',
              dayTextColor: '#fff',
              todayTextColor: '#ff80ab',
              arrowColor: '#ff80ab',
              monthTextColor: '#fff',
            }}
            style={{ marginBottom: 20, borderRadius: 10 }}
          />

          {selectedDate ? (
            slots[selectedDate]?.length > 0 ? (
              slots[selectedDate].map((vreme, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.slot, selectedSlot?.dan === selectedDate && selectedSlot?.vreme === vreme && styles.selectedSlot]}
                  onPress={() => setSelectedSlot({ dan: selectedDate, vreme })}
                >
                  <Text style={{
                    color: selectedSlot?.dan === selectedDate && selectedSlot?.vreme === vreme ? '#fff' : '#000',
                    fontWeight: 'bold'
                  }}>{vreme}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.info}>Nema slobodnih termina za ovaj dan.</Text>
            )
          ) : (
            <Text style={styles.info}>Izaberite dan iz kalendara.</Text>
          )}

          <TextInput
            placeholder="Vaše ime"
            placeholderTextColor="#aaa"
            value={ime}
            onChangeText={setIme}
            style={styles.input}
          />
          <TextInput
            placeholder="Vaše prezime"
            placeholderTextColor="#aaa"
            value={prezime}
            onChangeText={setPrezime}
            style={styles.input}
          />
          <TextInput
            placeholder="Email za obaveštenje"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Vaš broj telefona"
            placeholderTextColor="#aaa"
            value={telefonUcenika}
            onChangeText={setTelefonUcenika}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TouchableOpacity onPress={zakaziCas} style={styles.button}>
            <Text style={styles.buttonText}>Zakaži čas</Text>
          </TouchableOpacity>

          <Text style={styles.section}>📝 Komentari i ocene</Text>

          {mozeOceniti && (
            <View>
              <TextInput
                placeholder="Unesite ocenu (1-5)"
                placeholderTextColor="#aaa"
                value={ocena}
                onChangeText={setOcena}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Vaš komentar"
                placeholderTextColor="#aaa"
                value={komentar}
                onChangeText={setKomentar}
                multiline
                style={[styles.input, { height: 80 }]}
              />
              <TouchableOpacity onPress={posaljiKomentar} style={styles.button}>
                <Text style={styles.buttonText}>Pošalji ocenu i komentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {oceneKomentari.map((item, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <Text style={styles.infoText}>⭐ Ocena: {item.ocena}</Text>
              <Text style={styles.infoText}>💬 {item.komentar}</Text>
            </View>
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
  },
  name: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#ccc',
    marginBottom: 4,
  },
  section: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  slot: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSlot: {
    backgroundColor: '#ff69b4',
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    borderColor: '#444',
    borderWidth: 1,
    fontFamily: 'Poppins',
  },
  info: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
    fontFamily: 'Poppins',
  },
  button: {
    backgroundColor: '#ff69b4',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'PoppinsBold',
    fontSize: 16,
  },
});
