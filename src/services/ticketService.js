import { SucceededToaster } from "../components/utility/Toaster";
import apiAuthClient from "./apiAuthClient";
import apiClient from "./apiClient";
export const tickets = async (p, s) => {
  const response = await apiAuthClient.get(`Tickets?PageNumber=${p}&PageSize=${s}`);
  return response.data;
};

export const ticketID = async (id) => {
  const response = await apiAuthClient.get(`/Tickets/${id}`);
  if (response.status === 200) {
    SucceededToaster(response.data.status.message + ' : Fetch Query.');
    return response.data;
  } else {
    SucceededToaster(response.status + ' : Internal Server Error.');
    return response.data;
  }
};

export const postTicket = async (data) => {
  const response = await apiAuthClient
    .post("/Ticket", data)
    .then(function (response) {
      console.log(response);
      SucceededToaster(response.data.status.message + ' : Send Query.');
      return response;
    })
    .catch(function (error) {
      console.log(error);
      SucceededToaster(error.message + ' : Internal Server Error.');
      return response;
    });

  return response;
};
export const updateTickets = async (data) => {
  const response = await apiAuthClient
    .post("/Ticket", data)
    .then(function (response) {
      SucceededToaster(response.data.status.message + ' : Send Query.');
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
