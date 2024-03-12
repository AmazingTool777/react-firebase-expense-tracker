// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";
import {
  collection,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqOZSmhzYCzuVfN1l-92BHIwWUpico4Hc",
  authDomain: "fir-demo-69f18.firebaseapp.com",
  projectId: "fir-demo-69f18",
  storageBucket: "fir-demo-69f18.appspot.com",
  messagingSenderId: "196375730754",
  appId: "1:196375730754:web:3aa35193b21ea6d3b06bdb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Connection to the local emulators for local development
if (location.hostname === "localhost") {
  connectEmulators();
}

// Connects to the local emulators
async function connectEmulators() {
  // Local emultors settings
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8082);
}

export const collectionsRefs = {
  users: collection(db, "users"),
  transactions: collection(db, "transactions"),
};
