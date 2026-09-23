import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Replace the placeholder values below with your Firebase project's configuration keys.
// You can get these keys from your Firebase Console (Project Settings > General > Your Apps).
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_PLACEHOLDER",
  authDomain: "himgatha-v2.firebaseapp.com",
  projectId: "himgatha-v2",
  storageBucket: "himgatha-v2.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: "YOUR_APP_ID_PLACEHOLDER",
  measurementId: "YOUR_MEASUREMENT_ID_PLACEHOLDER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const db = getFirestore(app);

// Enable offline persistence for low-bandwidth valley environments
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore offline persistence failed: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore offline persistence failed: Browser does not support it.');
    }
  });
}

export const auth = getAuth(app);
export const storage = getStorage(app);
export { firebaseConfig };

// Admin Email Token configuration
export const ADMIN_EMAIL = "himgatha.admin@gmail.com";

export default app;
