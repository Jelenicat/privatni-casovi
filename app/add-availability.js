// app/add-availability.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AddAvailability() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [savedSlots, setSavedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userId, setUserId] = useState(null);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const snap = await getDoc(doc(db, 'profesori', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.trajanjeCasa) setDuration(Number(data.trajanjeCasa));
        }
      }
    });
    return unsubscribe;
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    const startMinutes = 8 * 60;
    const endMinutes = 22 * 60;

    for (let current = startMinutes; current + duration <= endMinutes; current += duration) {
      const hours = String(Math.floor(current / 60)).padStart(2, '0');
      const mins = String(current % 60).padStart(2, '0');
      slots.push(`${hours}:${mins}`);
    }

    return slots;
  };

  const toggleSlot = (time) => {
    if (bookedSlots.includes(time)) return;
    if (selectedSlots.includes(time)) {
      setSelectedSlots((prev) => prev.filter((t) => t !== time));
    } else {
      setSelectedSlots((prev) => [...prev, time]);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      Alert.alert('Greška', 'Izaberite datum i barem jedan termin.');
      return;
    }
    try {
      await setDoc(doc(db, 'profesori', userId, 'slobodniTermini', selectedDate), {
        vreme: selectedSlots,
      });
      Alert.alert('Uspeh', 'Termini su sačuvani. Možete sada izabrati novi dan.');
      setSelectedSlots([]);
      setSavedSlots([]);
      setSelectedDate(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Greška', 'Nešto nije uspelo.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'profesori', userId, 'slobodniTermini', selectedDate));
      Alert.alert('Obrisano', 'Svi termini za taj dan su obrisani.');
      setSelectedSlots([]);
      setSavedSlots([]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSavedSlots = async (date) => {
    try {
      const ref = doc(db, 'profesori', userId, 'slobodniTermini', date);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setSelectedSlots(data.vreme || []);
        setSavedSlots(data.vreme || []);
      } else {
        setSelectedSlots([]);
        setSavedSlots([]);
      }

      const q = query(collection(db, 'rezervacije'), where('profesorId', '==', userId), where('datum', '==', date));
      const bookedSnap = await getDocs(q);
      const booked = bookedSnap.docs.map(doc => doc.data().vreme);
      setBookedSlots(booked);
    } catch (error) {
      console.error('Greška pri učitavanju:', error);
    }
  };

  const handleDayPress = async (day) => {
    const date = day.dateString;
    if (selectedSlots.sort().join(',') !== savedSlots.sort().join(',')) {
      Alert.alert('Upozorenje', 'Sačuvaj termine pre prelaska na drugi dan.');
      return;
    }
    setSelectedDate(date);
    if (userId) loadSavedSlots(date);
  };

  const timeSlots = generateTimeSlots();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}><Ionicons name="calendar" size={20} color="#fff" /> Izaberi datum</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#f06292' } } : {}}
        theme={{
          calendarBackground: '#1f1f1f',
          dayTextColor: '#fff',
          todayTextColor: '#ff80ab',
          arrowColor: '#ff80ab',
          monthTextColor: '#fff',
        }}
        style={{ borderRadius: 16, marginBottom: 25 }}
      />

      {selectedDate && (
        <>
          <Text style={styles.header}><Ionicons name="time-outline" size={20} color="#fff" /> Termini za {selectedDate}</Text>
          <View style={styles.slotContainer}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => toggleSlot(time)}
                disabled={bookedSlots.includes(time)}
                style={[styles.slot,
                  selectedSlots.includes(time) && styles.selectedSlot,
                  bookedSlots.includes(time) && styles.bookedSlot,
                ]}
              >
                <Text style={
                  bookedSlots.includes(time)
                    ? styles.bookedSlotText
                    : selectedSlots.includes(time)
                    ? styles.slotTextSelected
                    : styles.slotText
                }>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButtonWrapper} onPress={handleSave}>
            <LinearGradient colors={['#ff80ab', '#f06292']} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Sačuvaj termine</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete} style={{ marginTop: 10 }}>
            <Text style={{ color: '#aaa', textAlign: 'center', fontFamily: 'Poppins' }}>🗑 Obriši sve za ovaj dan</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
    fontFamily: 'PoppinsBold',
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 20,
  },
  slot: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#f06292',
  },
  bookedSlot: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  slotText: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  slotTextSelected: {
    color: '#fff',
    fontFamily: 'PoppinsBold',
    fontSize: 14,
  },
  bookedSlotText: {
    color: '#ccc',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  saveButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#fff',
  },
});