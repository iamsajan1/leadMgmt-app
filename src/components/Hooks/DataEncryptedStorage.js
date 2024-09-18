import EncryptedStorage from 'react-native-encrypted-storage';

export const storeDataEncrypt = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
    console.log('Data stored successfully!');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getDataEncrypt = async (key) => {
  try {
    const value = await EncryptedStorage.getItem(key);
    if (value !== null) {
      // Data found
      return JSON.parse(value);
    } else {
      // Data not found
      console.log('No data found for key:', key);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};