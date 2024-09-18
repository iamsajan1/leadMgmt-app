import apiClient from "./apiClient";
import { SucceededToaster } from "../components/utility/Toaster";
import apiAuthClient from "./apiAuthClient";


export const getLoginUrl = async () => {
  const response = await apiAuthClient.get(`/GetLoginUrl`);
  // console.log("🚀 ~ file: googleService.js:7 ~ getLoginUrl ~ response:", response.data.data.url)
  return response.data.data.url;
};

export const gmailIntegrate = async (data) => {
  const response = await apiAuthClient
    .post("/Integrate", data)
    .then(function (response) {
      SucceededToaster('Gmail Integration : ' + response.data.status.message);
      console.log(response);
      return response;
    })
    .catch((error) => {
      SucceededToaster(error.message);
      console.log(error);
      return response;
    });
  return response;
};

export const accessToken = async () => {
  const response = await apiAuthClient.get(`/AccessToken`);
  // console.log("🚀 ~ file: googleService.js:7 ~ getLoginUrl ~ response:", response.data.data.url)
  return response.data.data.url;
};
