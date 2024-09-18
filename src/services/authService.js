import EncryptedStorage from "react-native-encrypted-storage";
import { SucceededToaster } from "../components/utility/Toaster";
import apiClient from "./apiClient";

export const authService = async (data) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  const response = await apiClient
    .post("/auth", data)
    .then(function (response) {
      EncryptedStorage.setItem('user_session', JSON.stringify(response.data.data));
      EncryptedStorage.setItem('token', JSON.stringify(response.data.data.token)) ;
      EncryptedStorage.setItem('tokenDate', JSON.stringify(formattedDate));
      console.log(' date:', formattedDate); 
      SucceededToaster('Authentication successful');
      
      return response;
    })
    .catch((error) => {
      SucceededToaster('Internal Server error : '+ error.message);
      return response;
    });
  return response;
};
