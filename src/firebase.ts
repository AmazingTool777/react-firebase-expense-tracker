// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
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

export const collectionsRefs = {
  users: collection(db, "users"),
  transactions: collection(db, "transactions"),
  balance: collection(db, "balance"),
};
