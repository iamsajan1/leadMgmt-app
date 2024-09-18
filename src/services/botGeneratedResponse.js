import { SucceededToaster } from "../components/utility/Toaster";
import apiAuthClient from "./apiAuthClient";
import apiClient from "./apiClient";




export const botGeneratedResponse = async (data) => {
    const response = await apiAuthClient
      .post("/BotGeneratedResponse", data)
      .then(function (response) {
        SucceededToaster('Reply Your Message : ' + response.data.status.message)
        console.log('chat bot',response);
        return response;
      })
      .catch(error => {
        SucceededToaster('Internal Server error : '+ error.message)
        console.log(error);
        return error;
      });
      return response;
  };