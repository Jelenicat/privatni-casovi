// firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbF0_mHxCS2c2BQfyG9Q14p3rEYUxGDqk",
  authDomain: "privatnicasoviapp.firebaseapp.com",
  projectId: "privatnicasoviapp",
  storageBucket: "privatnicasoviapp.appspot.com",
  messagingSenderId: "1005650599004",
  appId: "1:1005650599004:web:b74d494ae6ba6120031a99"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
