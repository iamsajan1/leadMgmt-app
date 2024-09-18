import { SucceededToaster } from "../components/utility/Toaster";
import apiClient from "./apiClient";

export const registerService = async (data) => {
  console.log("🚀 ~ file: authService.js:5 ~ login ~ data:", data);
  const response = await apiClient
    .post("/register", data)
    .then(function (response) {
      SucceededToaster(response.data.status.message + ' : Register Successfully.');
      console.log(response);
      return response;
    })
    .catch((error) => {
      SucceededToaster(error.message + ' : Internal Server Error.');
      console.log(error);
      return response;
    });
  return response;
};
