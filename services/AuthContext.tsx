import React, { createContext, useContext, useState, useEffect } from 'react';
import {authIn as auth} from '../utils/firebaseConfig';
import EncryptedStorage from 'react-native-encrypted-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext mounted");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await auth.signInWithEmailAndPassword( email, password);
      setUser(userCredential.user);

      await EncryptedStorage.setItem('zenin_credentials', JSON.stringify({ email, password }));
    } catch (error) {
      console.log('Login error:', error.message);
      throw error; // Rethrow the error to be handled in the calling component
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await auth.createUserWithEmailAndPassword( email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.log('Signup error:', error.message);
      throw error; // Rethrow the error to be handled in the calling component
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
      await EncryptedStorage.removeItem('zenin_credentials');
    } catch (error) {
      console.log('Logout error:', error.message);
      throw error; // Rethrow the error to be handled in the calling component
    } finally {
      setLoading(false);
    }
  };

  const biometricLogin = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
  
      if (!available) {
        console.log('Biometric auth not supported');
        return false;
      }
  
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Log in with Biometrics',
      });
  
      if (success) {
        const storedCreds = await EncryptedStorage.getItem('zenin_credentials');
        if (storedCreds) {
          const { email, password } = JSON.parse(storedCreds);
          await login(email, password);
          return true;
        } else {
          console.log('No stored credentials found');
          return false;
        }
      } else {
        console.log('User cancelled biometric prompt');
        return false;
      }
    } catch (err) {
      console.log('Biometric auth error:', err.message || err);
      return false;
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, biometricLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
