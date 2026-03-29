import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT3ngGWaXPbLJv9U2GXkW6w-3O6AaZGN4",
  authDomain: "pregnancy-tracker-and-an-31f16.firebaseapp.com",
  projectId: "pregnancy-tracker-and-an-31f16",
  storageBucket: "pregnancy-tracker-and-an-31f16.firebasestorage.app",
  messagingSenderId: "348915149405",
  appId: "1:348915149405:web:8fe6d23d549e9675b5fbb4",
  measurementId: "G-VHMCRB0GZL"
};

// Initialize Firebase only if API key exists to prevent crash
const app = firebaseConfig.apiKey && !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = app ? getAuth(app) : null as any;
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with modern offline persistence (fixes deprecation warning)
export const db = app ? initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
}) : null as any;

export const storage = app ? getStorage(app) : null as any;
