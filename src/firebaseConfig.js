import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; // If you want to use Firebase Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import App from "./App";

const firebaseConfig = {
  apiKey: "AIzaSyCpmeCTEIUKWtFOcRB3bqqrnwnNYxJ8Ms4",
  authDomain: "reactwings.firebaseapp.com",
  projectId: "reactwings",
  storageBucket: "reactwings.firebasestorage.app",
  messagingSenderId: "661039689202",
  appId: "1:661039689202:web:526f5cd3cd5c67798c0f6b",
  measurementId: "G-FSKVJBJ108"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
export const db = getFirestore(app);
export const auth = getAuth(app);
