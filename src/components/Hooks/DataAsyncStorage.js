import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataAsync = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data stored successfully!');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getDataAsync = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
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