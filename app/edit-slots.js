// app/edit-slots.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function EditSlots() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState(45);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [savedDates, setSavedDates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTrajanje = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'profesori', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const trajanje = parseInt(data.trajanjeCasa);
          setDuration(trajanje);
          generateTimeSlots(trajanje);
        }
      }
    };
    fetchTrajanje();
  }, []);

  const generateTimeSlots = (duration) => {
    const start = 8 * 60;
    const end = 22 * 60;
    const step = duration;
    const slots = [];
    for (let time = start; time + step <= end; time += step) {
      const hours = Math.floor(time / 60).toString().padStart(2, '0');
      const minutes = (time % 60).toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
    }
    setTimeSlots(slots);
  };

  const toggleTime = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const saveSlots = async () => {
    const user = auth.currentUser;
    if (!user || selectedTimes.length === 0) return;

    const dateKey = selectedDate.toISOString().split('T')[0];
    try {
      await setDoc(doc(db, 'profesori', user.uid, 'slobodniTermini', dateKey), {
        vreme: selectedTimes,
      });
      Alert.alert('Uspeh', `Termini za ${dateKey} su sačuvani.`);
      setSavedDates([...savedDates, dateKey]);
      setSelectedTimes([]);
    } catch (error) {
      console.error('Greška pri čuvanju termina:', error);
      Alert.alert('Greška', 'Neuspešno čuvanje termina.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dodaj slobodne termine</Text>

      <Button title="Izaberi datum" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <Text style={styles.subTitle}>Dostupna vremena za {duration} min</Text>
      <View style={styles.grid}>
        {timeSlots.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeBtn, selectedTimes.includes(time) && styles.selectedBtn]}
            onPress={() => toggleTime(time)}
          >
            <Text style={selectedTimes.includes(time) ? styles.selectedText : styles.text}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Sačuvaj termine" onPress={saveSlots} color="#007AFF" />

      {savedDates.length > 0 && (
        <Text style={{ marginTop: 20 }}>Sačuvani datumi: {savedDates.join(', ')}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBtn: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedBtn: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  text: { color: '#000' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
});