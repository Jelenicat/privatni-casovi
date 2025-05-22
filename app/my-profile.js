// app/my-profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        const ref = doc(db, 'profesori', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>Učitavanje profila...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Nema podataka o profilu.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Moj profil</Text>
      <Text style={styles.label}>Ime: <Text style={styles.value}>{profile.ime}</Text></Text>
      {profile.opis ? (
  <>
    <Text style={styles.subTitle}>O meni:</Text>
    <Text style={styles.value}>{profile.opis}</Text>
  </>
) : null}

      <Text style={styles.label}>Email: <Text style={styles.value}>{auth.currentUser.email}</Text></Text>
      <Text style={styles.label}>Grad: <Text style={styles.value}>{profile.gradovi ? Object.entries(profile.gradovi).filter(([, v]) => v).map(([k]) => k).join(', ') : 'N/A'}</Text></Text>
      <Text style={styles.label}>Opštine: <Text style={styles.value}>{profile.opstine ? Object.entries(profile.opstine).filter(([, v]) => v).map(([k]) => k).join(', ') : 'N/A'}</Text></Text>
      <Text style={styles.label}>Trajanje časa: <Text style={styles.value}>{profile.trajanjeCasa} minuta</Text></Text>

      <Text style={styles.subTitle}>Predmeti:</Text>
      {Object.entries(profile.predmeti || {}).filter(([, v]) => v).map(([k]) => (
        <Text key={k} style={styles.value}>• {k}</Text>
      ))}

      <Text style={styles.subTitle}>Nivo obrazovanja:</Text>
      {Object.entries(profile.nivoi || {}).filter(([, v]) => v).map(([k]) => (
        <Text key={k} style={styles.value}>• {k}</Text>
      ))}

      <LinearGradient colors={["#ff69b4", "#ff8bbd"]} style={styles.button}>
        <TouchableOpacity onPress={() => router.push('/edit-profile')}><Text style={styles.buttonText}>Izmeni profil</Text></TouchableOpacity>
      </LinearGradient>
      <LinearGradient colors={["#ff69b4", "#ff8bbd"]} style={styles.button}>
        <TouchableOpacity onPress={() => router.push('/add-availability')}><Text style={styles.buttonText}>Dodaj termine</Text></TouchableOpacity>
      </LinearGradient>
      <LinearGradient colors={["#ff69b4", "#ff8bbd"]} style={styles.button}>
        <TouchableOpacity onPress={() => router.push('/calendar-view')}><Text style={styles.buttonText}>Kalendar</Text></TouchableOpacity>
      </LinearGradient>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Odjavi se</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#FF69B4',
    fontFamily: 'Poppins-Bold',
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#222',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  centered: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
});
