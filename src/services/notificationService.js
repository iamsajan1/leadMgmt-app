import { SucceededToaster } from '../components/utility/Toaster';
import apiAuthClient from './apiAuthClient';
import apiClient from './apiClient';

export const Notifications = async (p, s) => {
  const response = await apiAuthClient.get(
    `Notifications?PageNumber=${p}&PageSize=${s}`,
  );
  if (response.status === 200) {
     return response.data;
  } else {
    SucceededToaster(response.status + ' : Internal Server Error.');
    return response.data;
  }
};
export const postNotificationsStatus = async (data) => {
  const response = await apiAuthClient
    .post("/ReadNotification", data)
    .then(function (response) {
      // handleSuccessClick(response);
      //console.log(response);
      return response;
    })
    .catch((error) => {
      handleErrorClick(error);
      //console.log(error);
      return response;
    });
  return response;
};



