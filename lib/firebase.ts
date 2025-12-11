import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import doc/getDoc here
import { getAuth } from "firebase/auth"; // <--- CRITICAL IMPORT

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAX5NloW5VLyqxK_QQwWzXXLI0zu-mfCLU",
  authDomain: "myfellowpet-prod.firebaseapp.com",
  projectId: "myfellowpet-prod",
  storageBucket: "myfellowpet-prod.firebasestorage.app",
  messagingSenderId: "442628504378",
  appId: "1:442628504378:web:78a33db6419de9b42aae03"
};

// Initialize the app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- EXPORT SERVICES ---

// Use a type for the GeoPoint structure, as Firestore's GeoPoint isn't always available client-side in non-Node contexts
export interface GeoPointLike {
    latitude: number;
    longitude: number;
}

// 1. Export Firestore
export const db = getFirestore(app);

// 2. Export Auth (This is what was missing!)
export const auth = getAuth(app); 

// 3. Export helper functions so other files can import them from here
export { doc, getDoc };