import apiClient from "./apiClient";
import { Alert } from 'react-native'; // Import the Alert module
import apiAuthClient from "./apiAuthClient";
import moment from 'moment';
import { SucceededToaster } from "../components/utility/Toaster";
  export const users = async (p, s) => {
    try {
      console.log('Fetching users...');
      const response = await apiAuthClient.get(`/users?PageNumber=${p}&PageSize=${s}`);
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };


export const userId = async (id) => {
  const response = await apiAuthClient.get(`/users/${id}`);
  return response.data;
};

export const getUserCalls = async (pageNumber, search, pageSize, selectedUser, startDate, endDate) => {
  try {
    const params = {
      PageNumber: pageNumber,
      Search: search,
      PageSize: pageSize,
      ...(selectedUser && { UserId: selectedUser }),
      ...(startDate !== null && { StartDate: startDate }),
      ...(endDate !== null && { EndDate: endDate }),
    };
    
    const response = await apiAuthClient.get('/UserCalls', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching user calls:", error);
    throw error;
  }
};



export const postUser = async (data) => {
  try {
    const response = await apiAuthClient.post("/User", data);
    Alert.alert(
      'Success',
      'User posted successfully',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
    return response;
  } catch (error) {
    console.error("Error posting user:", error);
    Alert.alert(
      'Error',
      'Failed to post user',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
    throw error;
  }
};

export const updateUser = async (userId, data) => { // Accept userId as a parameter
  try {
    console.log('Updated user profile:', data);
    const response = await apiAuthClient.post(`/user/${userId}`, data); // Include userId in the URL
    console.log('Update response:', response);
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
export const getUserReport = async (id, startDate, endDate) => {
  try {
    const paramsData = { userId: id };

    if (startDate) paramsData.startDate = startDate;
    if (endDate) paramsData.endDate = endDate;

    console.log('Requesting /GetUserSummary with params:', paramsData);

    const response = await apiAuthClient.get('/GetUserSummary', {
      params: paramsData,
    });

    return response.data;
  } catch (error) {
    // Format error message
    const errorMessage = error.response?.data?.message || error.message || 'Error fetching user data';
    throw new Error(errorMessage); // Make sure to throw a simple string message
  }
};


export const getUserCallReport = async (id, startDate, endDate) => {
  try {
    // Default to today's date if startDate or endDate are not provided
    const today = moment().format('YYYY-MM-DD'); // Adjust format as needed for your API

    const paramsData = { 
      UserId: id,
      StartDate: startDate || today,
      EndDate: endDate || today
    };

    console.log('Requesting /GetUserCallsReport with params:', paramsData);

    // Make the GET request with the params
    const response = await apiAuthClient.get('/GetUserCallsReport', {
      params: paramsData,
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors and throw an appropriate error message
    const errorMessage = error.response?.data?.message || error.message || 'Error fetching user call data';
    throw new Error(errorMessage);
  }
};


export const DashboardCallSummary = async (startDate, endDate) => {
  try {
    // Create the paramsData object, including dates only if provided
    const paramsData = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    };

    const response = await apiAuthClient.get('/DashboardCallSummary', {
      params: paramsData,
    });
    
    if (response.status === 200) {
       return response.data;
    } else {
       return null;
    }
  } catch (error) {
     throw error; 
  }
};
