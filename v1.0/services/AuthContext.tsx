import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "@/utils/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import messaging from "firebase/messaging";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // useEffect(() => {
  //   const handleNotification = async (remoteMessage, uid) => {
  //     // Add your notification handling logic here
  //     console.log("Handling notification for user:", uid);
  //     console.log("Notification message:", remoteMessage);
  //   };

  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     const uid = auth.currentUser?.uid;
  //     console.log(uid);

  //     if (uid) {
  //       await handleNotification(remoteMessage, uid);
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      // router.replace('/')
      await SecureStore.setItemAsync("zenin_email", email);
      await SecureStore.setItemAsync("zenin_pass", password);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      await SecureStore.deleteItemAsync("zenin_email");
      await SecureStore.deleteItemAsync("zenin_pass");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const biometricLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        console.log("Biometric auth not available");
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Biometrics",
      });

      if (result.success) {
        console.log("Biometric auth succeeded");

        const email = await SecureStore.getItemAsync("zenin_email");
        const password = await SecureStore.getItemAsync("zenin_pass");

        if (email && password) {
          await login(email, password); // reuse your login function
          return true;
        } else {
          console.log("No stored credentials found.");
          return false;
        }
      } else {
        console.log("Biometric auth failed or cancelled");
        return false;
      }
    } catch (err) {
      console.log("Biometric auth error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, biometricLogin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
