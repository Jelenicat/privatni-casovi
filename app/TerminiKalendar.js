// app/TerminiKalendar.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function TerminiKalendar() {
  const [dan, setDan] = useState('');
  const [vreme, setVreme] = useState('');
  const [sviTermini, setSviTermini] = useState([]);

  useEffect(() => {
    const fetchTermini = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const docRef = doc(db, 'profesori', uid, 'slobodniTermini', dan);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSviTermini(snap.data().vreme || []);
      } else {
        setSviTermini([]);
      }
    };
    if (dan) fetchTermini();
  }, [dan]);

  const dodajTermin = async () => {
    if (!dan || !vreme) {
      Alert.alert('Greška', 'Unesite datum i vreme.');
      return;
    }
    try {
      const uid = auth.currentUser?.uid;
      const terminRef = doc(db, 'profesori', uid, 'slobodniTermini', dan);
      await setDoc(terminRef, { vreme: arrayUnion(vreme) }, { merge: true });
      Alert.alert('Uspeh', 'Termin dodat.');
      setVreme('');
    } catch (err) {
      console.error(err);
      Alert.alert('Greška', 'Nešto nije uspelo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj slobodan termin</Text>
      <TextInput
        placeholder="Datum (npr. 2025-05-20)"
        value={dan}
        onChangeText={setDan}
        style={styles.input}
      />
      <TextInput
        placeholder="Vreme (npr. 14:00)"
        value={vreme}
        onChangeText={setVreme}
        style={styles.input}
      />
      <Button title="Dodaj termin" onPress={dodajTermin} color="#007AFF" />

      {sviTermini.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Postojeći termini za {dan}:</Text>
          <FlatList
            data={sviTermini}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => <Text style={styles.termin}>{item}</Text>}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 },
  termin: { fontSize: 16, marginVertical: 4 },
});
