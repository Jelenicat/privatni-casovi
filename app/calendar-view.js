import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

export default function CalendarView() {
  const [markedDates, setMarkedDates] = useState({});
  const [terminiPoDanu, setTerminiPoDanu] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchTermini = async () => {
      const user = auth.currentUser;
      if (!user) return;

      let oznake = {};
      let poDanu = {};

      const slobodniRef = collection(db, 'profesori', user.uid, 'slobodniTermini');
      const slobodniSnap = await getDocs(slobodniRef);
      slobodniSnap.forEach(doc => {
        const dan = doc.id;
        const vremena = doc.data().vreme || [];
        if (!oznake[dan]) oznake[dan] = { dots: [] };
        oznake[dan].dots.push({ color: 'green' });
        poDanu[dan] = [...(poDanu[dan] || []), ...vremena.map(v => ({ vreme: v, tip: 'slobodan' }))];
      });

      const rezRef = collection(db, 'rezervacije');
      const q = query(rezRef, where('profesorId', '==', user.uid));
      const rezSnap = await getDocs(q);
      rezSnap.forEach(docSnap => {
        const { datum, vreme, ime, prezime } = docSnap.data();
        const ucenikIme = ime && prezime ? `${ime} ${prezime}` : 'Nepoznat učenik';

        if (!oznake[datum]) oznake[datum] = { dots: [] };
        oznake[datum].dots.push({ color: 'red' });

        poDanu[datum] = [...(poDanu[datum] || []), { vreme, tip: 'zauzet', ucenik: ucenikIme }];
      });

      setMarkedDates(oznake);
      setTerminiPoDanu(poDanu);
    };

    fetchTermini();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);

  const prikaziTermine = () => {
    const termini = terminiPoDanu[selectedDate] || [];
    if (termini.length === 0) {
      return (
        <View style={styles.noTerminiWrapper}>
          <Text style={styles.noTerminiText}>📭 Nema termina za ovaj dan</Text>
        </View>
      );
    }

    return termini
      .sort((a, b) => a.vreme.localeCompare(b.vreme))
      .map((t, i) => (
        <Animated.View
          key={i}
          style={[styles.terminCard, t.tip === 'zauzet' ? styles.zauzetCard : styles.slobodanCard, { opacity: fadeAnim }]}
        >
          <FontAwesome
            name={t.tip === 'zauzet' ? 'times-circle' : 'check-circle'}
            size={18}
            color={t.tip === 'zauzet' ? '#ff5252' : 'lightgreen'}
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.terminText}>{t.vreme} - {t.tip === 'zauzet' ? 'Zauzet' : 'Slobodan'}</Text>
            {t.tip === 'zauzet' && t.ucenik && (
              <Text style={styles.ucenikText}>👤 {t.ucenik}</Text>
            )}
          </View>
        </Animated.View>
      ));
  };

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: '#121212',
          calendarBackground: '#121212',
          textSectionTitleColor: '#aaa',
          selectedDayBackgroundColor: '#f06292',
          selectedDayTextColor: '#fff',
          todayTextColor: '#f06292',
          dayTextColor: '#fff',
          arrowColor: '#f06292',
          monthTextColor: '#fff',
          textMonthFontFamily: 'PoppinsBold',
          textDayFontFamily: 'Poppins',
          textDayHeaderFontFamily: 'Poppins',
        }}
        markingType="multi-dot"
        markedDates={{
          ...markedDates,
          ...(selectedDate ? { [selectedDate]: { ...markedDates[selectedDate], selected: true, selectedColor: '#f06292' } } : {})
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          fadeAnim.setValue(0);
        }}
      />

      <ScrollView style={styles.lista}>
        <Text style={styles.naslov}>{selectedDate || 'Izaberi dan u kalendaru'}</Text>
        {selectedDate ? prikaziTermine() : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  lista: {
    marginTop: 15,
  },
  naslov: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
  },
  terminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  slobodanCard: {
    backgroundColor: '#1f3520',
  },
  zauzetCard: {
    backgroundColor: '#3a1f1f',
  },
  terminText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins',
  },
  ucenikText: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Poppins',
    marginTop: 2,
  },
  noTerminiWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  noTerminiText: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});