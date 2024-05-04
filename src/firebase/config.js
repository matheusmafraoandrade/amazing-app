import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// DONE: Colocar o firebaseConfig do seu app aqui abaixo
const firebaseConfig = {
  apiKey: "AIzaSyA6CwJBugO4ZI6x5J360L8LG4tbJZQBkyY",
  authDomain: "pdf-chatter-bdadd.firebaseapp.com",
  projectId: "pdf-chatter-bdadd",
  storageBucket: "pdf-chatter-bdadd.appspot.com",
  messagingSenderId: "840100177931",
  appId: "1:840100177931:web:5b121fd8ba34a695867f0e",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// TODO: Descomentar código abaixo após ativar o App Check

// const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaV3Provider("abcdefghijklmnopqrstuvwxy-1234567890abcd"), // TODO: Colocar a chave do seu reCAPTCHA v3
//   isTokenAutoRefreshEnabled: true,
// });

// Initialize services
const db = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Timestamp
const timestamp = serverTimestamp();

// Google Sign In
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, timestamp, googleProvider };
