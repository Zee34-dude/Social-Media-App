// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe8J7byKnfAxNKnz_psHCQ7xQVJaSrw-w",
  authDomain: "social-app-efd35.firebaseapp.com",
  projectId: "social-app-efd35",
  storageBucket: "social-app-efd35.firebasestorage.app",
  messagingSenderId: "32470914873",
  appId: "1:32470914873:web:4232839559289da1ca3ae8",
  measurementId: "G-L05E15TLVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const Provider = new GoogleAuthProvider
export const db=getFirestore(app)
export const storage=getStorage(app)