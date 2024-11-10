// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbG7Wm8xVJUGAw0Z2b6B3_WMqCXPY__sk",
  authDomain: "chime-by-roam.firebaseapp.com",
  projectId: "chime-by-roam",
  storageBucket: "chime-by-roam.appspot.com",
  messagingSenderId: "835544794985",
  appId: "1:835544794985:web:7a12894d7d9e2e99ecdff8",
  measurementId: "G-JWFQ59K5T2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, ref, uploadBytes, getDownloadURL, collection, addDoc, getDocs, query, orderBy, limit };
