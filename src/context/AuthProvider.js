import React, { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SucceededToaster } from '../components/utility/Toaster';
import { registerService } from '../services/registerService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [passCode, setPassCode] = useState('');
  const [enteredPassCode, setEnteredPassCode] = useState('');
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const storedUser = await EncryptedStorage.getItem('user_session');
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (Data) => {
      const response = await authService(Data);
      console.log('response',response);
if (response) {
  const fetchUser = await EncryptedStorage.getItem('user_session');
  console.log('fetchUser',fetchUser);
  setUser(fetchUser);
} else {
  SucceededToaster('User Not Found');
}
  };

  const register = async (userData) => {
    try {
      const response = await registerService(userData);

      if (response && response.status === 200) {
        const { token } = response.data;

        if (token) {
          await EncryptedStorage.setItem('user_session', token);
          setUser(response.data);
        } else {
          SucceededToaster('Token is missing. Something is wrong.');
        }
      } else {
        SucceededToaster('Registration failed: ' + response?.status?.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      SucceededToaster('Error during registration. Please try again.');
    }
  };
  
  const logout = async () => {
    await EncryptedStorage.clear();
    await AsyncStorage.clear();
    SucceededToaster('Logout');
    setUser(null);
  };

  const onSetPassCode = async (passCode) => {
    if (passCode.length === 4) {
      try {
        await EncryptedStorage.setItem('passCode', passCode);
        Alert.alert('passCode set successfully');
        setPassCode(passCode);
      } catch (error) {
        console.error('Error setting passCode set:', error);
      }
    } else {
      Alert.alert('passCode must be 4 digits long');
    }
  };

  const onEnterPassCode = async (enteredPassCode) => {
    const storedPassCode = await EncryptedStorage.getItem('passCode'); // Corrected variable name
    if (enteredPassCode === storedPassCode) {
      setEnteredPassCode(enteredPassCode);
      Alert.alert('Authentication successful');
    } else {
      Alert.alert('Authentication failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        passCode,
        enteredPassCode,
        onEnterPassCode,
        onSetPassCode,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
