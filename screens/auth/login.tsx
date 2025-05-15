// app/auth/login.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../services/AuthContext';
import {Snackbar} from 'react-native-paper';

export default function Login({navigation}) {
  const {login, biometricLogin} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({title: 'Zenin - Login'});
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      // navigation.navigate('Home');
    } catch (error) {
      console.log("login error",error);
      
      setSnackbarMsg(error.message || 'Login failed');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      const success = await biometricLogin();
      if (!success) {
        setSnackbarMsg('Biometric login failed or was cancelled.');
        setSnackbarVisible(true);
      } else {
      }
    } catch (err) {
      setSnackbarMsg('Biometric error: ' + err.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{color: '#fff', fontSize: 20}}>Loading...</Text>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zenin</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Login" onPress={handleLogin} color="#d32f2f" />

      <TouchableOpacity onPress={handleBiometricLogin}>
        <Text style={styles.bioLogin}>Login with Fingerprint</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Create an Account</Text>
      </TouchableOpacity>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
        style={{backgroundColor: '#d32f2f'}}>
        {snackbarMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 32,
    color: '#d32f2f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  bioLogin: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  link: {
    color: '#d32f2f',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
