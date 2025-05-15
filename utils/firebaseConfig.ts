import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCTO1YWW6J5brYU2r63d4wt4V90kiVqC5U',
  authDomain: 'zenin-e67d9.firebaseapp.com',
  projectId: 'zenin-e67d9',
  storageBucket: 'zenin-e67d9.appspot.com',
  messagingSenderId: '868556318611',
  appId: '1:868556318611:web:9ba84b0ba4732b1008ea66',
  measurementId: 'G-YJ4MV4FHN4',
};

// Initialize only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const authIn = auth();
export const db = firestore();
export const storageRef = storage();
