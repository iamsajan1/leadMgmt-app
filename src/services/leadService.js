import moment from 'moment';
import {SucceededToaster} from '../components/utility/Toaster';
import apiAuthClient from './apiAuthClient';
export const getLeads = async (status, p, q, s, startDate, endDate, priority) => {
  try {
    console.log('get lead data parameters:', status, p, q, s, startDate, endDate, priority);

    const query = q != null && q !== undefined ? q : '';
    console.log('query:', query);

    const params = {
      Status: status,
      PageNumber: p,
      Search: query,
      PageSize: s,
      StartDate: startDate,
      EndDate: endDate,
      Priority: priority
    };

    const response = await apiAuthClient.get('/leads', {
      params: params,
    });

    if (response.status === 200) {
      SucceededToaster(response.data.status.message + ' : Fetch Leads.');
      console.log('Successfully fetched', response.data);
      return response.data;
    } else {
      SucceededToaster(response.status + ' : Internal Server Error.');
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error; 
  }
};



export const getFollowUpLead = async (pageNumber, searchQuery, pageSize) => {
  try {
    const query = searchQuery != null ? searchQuery : '';
    const response = await apiAuthClient.get(`FollowUpLeads?PageNumber=${pageNumber}&Search=${query}&PageSize=${pageSize}`);
    
    if (response.status === 200) {
      console.log('Successfully fetched:', response.data);
       SucceededToaster(response.data.status.message + ' : Fetch Leads.');
      return response.data;
    } else {
      throw new Error(response.status + ' : Internal Server Error.');
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    SucceededToaster('Error fetching leads: ' + error.message);
    throw error;
  }
};

export const getLeadCallDuration = async (id) => {
  const response = await apiAuthClient.get(`/LeadCalls?LeadId=${id}`);
  if (response.status === 200) {
    SucceededToaster(response.data.status.message + ' : Fetch Leads call duration.');
    return response.data;
  } else {
    SucceededToaster(response.status + ' : Internal Server Error.');
    return response.data;
  }
};
export const getLeadById = async id => {
  const response = await apiAuthClient.get(`/leads/${id}`);
  if (response.status === 200) {
    SucceededToaster(response.data.status.message + ' : Fetch Lead Details.');
    return response.data;
  } else {
    SucceededToaster(response.status + ' : Internal Server Error.');
    return response.data;
  }
};

export const postLead = async data => {
  const response = await apiAuthClient
    .post('/Lead', data)
    .then(function (response) {
      SucceededToaster('Save Lead Data.');
      console.log(response);
      return response;
    })
    .catch(error => {
      SucceededToaster(error.message + 'Internal Server Error.');
      console.log(error);
      return response;
    });
  return response;
};

export const UpdateLeadStatus = async data => {
  const response = await apiAuthClient
    .post('/UpdateLeadStatus', data)
    .then(function (response) {
      SucceededToaster('Save Lead Data.');
      console.log(response);
      return response;
    })
    .catch(error => {
      SucceededToaster(error.message + 'Internal Server Error.');
      console.log(error);
      return response;
    });
  return response;
};

export const updateLeads = async data => {
  const response = await apiAuthClient
    .post('/UpdateLead', data)
    .then(function (response) {
      SucceededToaster('Update Lead Data.');
      console.log(response);
    })
    .catch(error => {
      SucceededToaster(error.message + 'Internal Server Error.');
      console.log(error);
    });
  return response;
};

export const LeadDetails = async id => {
  const response = await apiAuthClient.get(`/LeadDetails?LeadId=${id}`);
  if (response.status === 200) {
    // SucceededToaster(response.data.status.message + ' : Fetch Lead Comments Details.')
    return response.data;
  } else {
    SucceededToaster(response.status + 'Internal Server Error');
    return response.data;
  }
};

export const postLeadComments = async data => {
  const response = await apiAuthClient
    .post('/LeadDetail', data)
    .then(function (response) {
      SucceededToaster(
        response.data.status.message + ' : Save Lead Comments Details.',
      );
      // console.log(response);
      return response;
    })
    .catch(error => {
      SucceededToaster(error.message + ' : Internal Server Error.');
      console.log(error);
      return response;
    });
  return response;
};
export const postUpdateLeadStatus = async data => {
  const response = await apiAuthClient
    .post('/UpdateLeadStatus', data)
    .then(function (response) {
      SucceededToaster(
        response.data.status.message + ' : Save Lead Comments Details.',
      );
      // console.log(response);
      return response;
    })
    .catch(error => {
      SucceededToaster(error.message + ' : Internal Server Error.');
      console.log(error);
      return response;
    });
  return response;
};

export const LeadEmails = async id => {
  const response = await apiAuthClient.get(`LeadEmails?LeadId=${id}`);
  if (response.status === 200) {
    SucceededToaster(response.data.status.message + ' : Fetch Lead Emails.');
    return response.data;
  } else {
    SucceededToaster(response.status + 'Internal Server Error');
    return response.data;
  }
};

export const postLeadEmail = async data => {
  const response = await apiAuthClient
    .post('/LeadEmail', data)
    .then(function (response) {
      SucceededToaster(response.status + ' : Send Emails.');
      console.log(response);
      return response;
    })
    .catch(error => {
      SucceededToaster(error.message + ' : Internal Server Error.');
      console.log(error);
      return response;
    });
  return response;
};

//Get call service
export const LeadCall = async ( p, q, s) => {
  const query = q != null && q!=undefined ? q : '';
  const response = await apiAuthClient.get(`/UserCalls?PageNumber=${p}&Search=${q}&PageSize=${s}`);
  if (response.status === 200) {
    SucceededToaster(response.data.status.message + ' : Fetch  Follow Leads.');
    console.log('Successfully fetched',response.data);
    return response.data;
  } else {
    SucceededToaster(response.status + ' : Internal Server Error.');
    return response.data;
  }
};

//post call service
export const postLeadCall = async data => {
  const response = await apiAuthClient
    .post(`/LeadCall`, data)
    .then(function (response) {
      SucceededToaster(response.data.status.message + ' : Save Call Details.');
      console.log(response);
      return response;
    })
    .catch(error => {
      SucceededToaster(error.message + ' : Internal Server Error');
      console.log(error);
      return response;
    });
  return response;
};
