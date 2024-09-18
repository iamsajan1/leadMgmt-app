import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {REACT_NATIVE_PUBLIC_API_BASE_URL} from "@env"

const fetchAuthToken = async () => {
  try {
    const session = await EncryptedStorage.getItem('token');
    if (session) {
      const authToken = JSON.parse(session);
      // console.log('Token Data:', authToken);
      return authToken;
    } else {
      console.log('No token found in storage');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

const apiAuthClient = axios.create({
  baseURL:'http://209.182.232.141:9092/api/v1',
});

apiAuthClient.interceptors.request.use(async config => {
  const token = await fetchAuthToken();

  if (token) {
    // console.log('Token passed in request:', token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log('🚀 ~ apiAuthClient.interceptors.request.use ~ config:', config);
  return config;
});

export default apiAuthClient;
