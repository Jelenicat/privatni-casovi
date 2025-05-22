import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function SearchScreen() {
  const { nivo, gradovi, opstine, predmeti } = useLocalSearchParams();
  const [profesori, setProfesori] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'profesori'));
      const lista = [];
      const g = JSON.parse(gradovi || '{}');
      const o = JSON.parse(opstine || '{}');
      const p = JSON.parse(predmeti || '{}');

      snap.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        const nivoMatch = data.nivoi?.[nivo] === true;
        const gradMatch = Object.keys(g).some((k) => g[k] && data.gradovi?.[k]);
        const opstinaMatch = Object.keys(o).some((k) => o[k] && data.opstine?.[k]);
        const predmetMatch = Object.keys(p).some((k) => p[k] && data.predmeti?.[k]);

        if (nivoMatch && (gradMatch || opstinaMatch) && predmetMatch) {
          lista.push({ id, ...data });
        }
      });
      setProfesori(lista);
    };
    fetch();
  }, [nivo, gradovi, opstine, predmeti]);

  return (
    <ScrollView contentContainerStyle={[styles.container, profesori.length < 2 && styles.centered]}>
      <Text style={styles.title}>Rezultati pretrage</Text>
      {profesori.length === 0 ? (
        <Text style={styles.noResults}>Nema dostupnih profesora za izabrane kriterijume.</Text>
      ) : (
        profesori.map((prof) => (
          <TouchableOpacity
            key={prof.id}
            style={styles.card}
            onPress={() => router.push(`/professor/${prof.id}`)}
          >
            <Text style={styles.name}>{prof.ime || 'Nepoznat profesor'}</Text>
            {prof.opis ? (
  <Text style={[styles.info, { fontStyle: 'italic', color: '#aaa' }]}>
    {prof.opis.length > 100 ? prof.opis.slice(0, 100) + '...' : prof.opis}
  </Text>
) : null}

            <Text style={styles.info}>
              📍 {Object.keys(prof.gradovi || {}).filter((g) => prof.gradovi[g]).join(', ')}
            </Text>
            <Text style={styles.info}>
              📚 {Object.keys(prof.predmeti || {}).filter((p) => prof.predmeti[p]).join(', ')}
            </Text>
            <Text style={styles.info}>
              🎓 {Object.keys(prof.nivoi || {}).filter((n) => prof.nivoi[n]).join(', ')}
            </Text>
            <Text style={styles.price}>
              💰 {prof.cena ? `${prof.cena} RSD po času` : 'Cena nije navedena'}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  centered: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  noResults: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#ff69b4',
  },
  name: {
    fontSize: 20,
    fontFamily: 'PoppinsBold',
    color: '#fff',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#ccc',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#ff80ab',
    marginTop: 6,
  },
});