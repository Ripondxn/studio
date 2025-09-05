// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-wyyB-ySCgkzz--NTufacJaP9Qd73C6U",
  authDomain: "studio-2-99522.firebaseapp.com",
  projectId: "studio-2-99522",
  storageBucket: "studio-2-99522.appspot.com",
  messagingSenderId: "25153818642",
  appId: "1:25153818642:web:f196ac686e87f0618508cb",
  measurementId: "G-JLCDS11D08"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const messaging = (typeof window !== 'undefined') ? getMessaging(app) : null;

const requestForToken = async () => {
    if (!messaging) return null;
    try {
        const currentToken = await getToken(messaging, { vapidKey: 'BBNqa8M9eYt5vfhePBs8TvTPPoqVM5jH9VvgFu6w9SBBz2qUJBm5eThZSD68zm3BUytVz5TrsUfLAW9eiTmO7pk' });
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            // Send the token to your server and update the user's record
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};

// let analytics;
// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }

export { auth, firestore, messaging, requestForToken };