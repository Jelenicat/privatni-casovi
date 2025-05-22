import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const profile = await AsyncStorage.getItem('professorProfile');
        if (!profile) return;

        const parsedProfile = JSON.parse(profile);
        setMyId(parsedProfile.id);

        const storedBookings = await AsyncStorage.getItem('bookings');
        const all = storedBookings ? JSON.parse(storedBookings) : [];

        const mine = all.filter((b) => b.professorId === parsedProfile.id);
        setBookings(mine);
      } catch (e) {
        console.log('Greška pri učitavanju rezervacija', e);
      }
    };
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zakazani časovi</Text>
      {bookings.length === 0 ? (
        <Text style={styles.info}>Nemate zakazanih časova.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookingItem}>
              <Text style={styles.text}><Text style={styles.label}>Učenik:</Text> {item.studentName}</Text>
              <Text style={styles.text}><Text style={styles.label}>Datum:</Text> {item.date}</Text>
              <Text style={styles.text}><Text style={styles.label}>Vreme:</Text> {item.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, color: '#555' },
  bookingItem: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  text: { fontSize: 16 },
  label: { fontWeight: 'bold' },
});