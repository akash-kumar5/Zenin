// app/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebaseConfig";
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth state on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        console.log(token)
        setUser(token);
        router.replace("/");
      } else {
        router.replace("../auth/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
  
      if (user) {
        console.log("User authenticated:", user.uid);
        setUser(user);
        await AsyncStorage.setItem("authToken", user.uid);
        router.replace("/");
      } else {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("No auth token, logging out.");
          // setUser(null);
          // router.replace("../auth/login");
        } else {
          console.log("Token exists in AsyncStorage, NOT logging out.");
        }
      }
  
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  // Login with Firebase
  const login = async (email, password) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      await AsyncStorage.setItem("authToken", user.uid);
      router.replace("/");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  //signup with Firebase
const signup = async (email, password) => {
  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setUser(user);
    await AsyncStorage.setItem("authToken", user.uid);
    router.replace("/");
  } catch (error) {
    console.log(error.message);
  } finally{
    setLoading(false)
  }
};

  // Logout
  const logout = async () => {
    setLoading(true)
    await signOut(auth);
    await AsyncStorage.removeItem("authToken");
    setUser(null);
    router.replace("/auth/login");
    setLoading(false)
  };

  // if (loading) return <LoadingScreen />;


  return (
    <AuthContext.Provider value={{ user,signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

