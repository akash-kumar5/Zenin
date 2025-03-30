// app/auth/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCEeJVDTyGowcM9LsjctybVcwAMGZk6sPg",
    authDomain: "splitwise-c9380.firebaseapp.com",
    projectId: "splitwise-c9380",
    storageBucket: "splitwise-c9380.firebasestorage.app",
    messagingSenderId: "454656954013",
    appId: "1:454656954013:web:4ec6a3215909f0d594ce74",
    measurementId: "G-DHJN68WRZT"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
