// app/auth/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTO1YWW6J5brYU2r63d4wt4V90kiVqC5U",
  authDomain: "zenin-e67d9.firebaseapp.com",
  projectId: "zenin-e67d9",
  storageBucket: "zenin-e67d9.appspot.com",
  messagingSenderId: "868556318611",
  appId: "1:868556318611:web:9ba84b0ba4732b1008ea66",
  measurementId: "G-YJ4MV4FHN4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);  // Initialize Firestore
export const storage = getStorage(app);

// Custom Hook to Fetch Data from Firestore
export const useFetchData = () => {
  const [transactions, setTransactions] = useState<any[]>([]);  // Use proper typing if necessary
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current user ID (use the correct method based on your app's auth setup)
        const userId = auth.currentUser?.uid; // Example: Firebase Auth UID
        
        if (!userId) {
          console.error("No user is logged in");
          return;
        }

        // Fetch the user's transactions collection
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        const querySnapshot = await getDocs(transactionsRef);

        // Map through the documents and extract data
        const fetchedData = querySnapshot.docs.map(doc => doc.data());
        setTransactions(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { transactions, loading };
};
