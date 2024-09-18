import apiClient from "./apiClient";
import { handlesuccessClick, handleerrorClick } from "../util/message";
import apiAuthClient from "./apiAuthClient";

export const webHookGoogle = async (data) => {
  console.log(data);
  const response = await apiAuthClient
    .post("/WebHook/Google", data)
    .then(function (response) {
      handlesuccessClick(response);
      console.log(response);
      return response;
    })
    .catch((error) => {
      handleerrorClick(error);
      console.log(error);
      return response;
    });
  return response;
};

export const webHookProcess = async (data) => {
  console.log(data);
  const response = await apiAuthClient
    .post("/Webhook/Process", data)
    .then(function (response) {
      handlesuccessClick(response);
      console.log(response);
      return response;
    })
    .catch((error) => {
      handleerrorClick(error);
      console.log(error);
      return response;
    });
  return response;
};
