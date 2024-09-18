import apiAuthClient from '../apiAuthClient';
import { SucceededToaster } from '../components/utility/Toaster';

const UNIVERSITY_ID = '7b427a2f-5dce-41bc-a1b0-7d60165ba56f';
const BASE_URL = 'http://209.182.232.141:8085/api/v1';

export const GetCoursesDropdown = async () => {
    try {
        const response = await apiAuthClient.get(`${BASE_URL}/GetCoursesDropdown/${UNIVERSITY_ID}/`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('User is not authenticated or session has expired.');
            // Handle redirection to login or display message
            // Example:
            // router.push('/login');
        } else {
            console.error('An error occurred:', error.message);
            throw error;
        }
    }
};

export const GetSubCoursesDropdown = async (courseId) => {
    if (courseId) {
        try {
            const response = await apiAuthClient.get(`${BASE_URL}/GetSubCoursesDropdown/${UNIVERSITY_ID}/${courseId}/`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('User is not authenticated or session has expired.');
                // Handle redirection to login or display message
                // Example:
                // router.push('/login');
            } else {
                console.error('An error occurred:', error.message);
                throw error;
            }
        }
    }
};
