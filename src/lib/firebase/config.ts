// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-wyyB-ySCgkzz--NTufacJaP9Qd73C6U",
  authDomain: "studio-2-99522.firebaseapp.com",
  projectId: "studio-2-99522",
  storageBucket: "studio-2-99522.firebasestorage.app",
  messagingSenderId: "25153818642",
  appId: "1:25153818642:web:f196ac686e87f0618508cb",
  measurementId: "G-JLCDS11D08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
// let analytics;
// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }

export { auth, firestore };