import { getApp, getApps, initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTO1YWW6J5brYU2r63d4wt4V90kiVqC5U",
  authDomain: "zenin-e67d9.firebaseapp.com",
  projectId: "zenin-e67d9",
  storageBucket: "zenin-e67d9.appspot.com",
  messagingSenderId: "868556318611",
  appId: "1:868556318611:web:9ba84b0ba4732b1008ea66",
  measurementId: "G-YJ4MV4FHN4",
};

// Initialize only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
