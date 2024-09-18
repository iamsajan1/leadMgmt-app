import apiClient from "./apiClient";
import { SucceededToaster } from "../components/utility/Toaster";
import apiAuthClient from "./apiAuthClient";
// export const getLoginUrl = async () => {
//   const response = await apiClient.get(`/GetLoginUrl`);
//   // console.log("🚀 ~ file: googleService.js:7 ~ getLoginUrl ~ response:", response.data.data.url)
//   return response.data.data.url;
// };

export const emailService = async (data) => {
  const response = await apiAuthClient
    .post("/Send", data)
    .then(function (response) {
      SucceededToaster('Send Email : ' + response.data.status.message);
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
      SucceededToaster('Internal Server error : '+ error.message)
      return response;
    });
  return response;
};
