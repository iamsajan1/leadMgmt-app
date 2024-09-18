import apiAuthClient from "./apiAuthClient";
import apiClient from "./apiClient";

export const getUniversities = async () => {
  const response = await apiAuthClient.get(`/universities`);
  // console.log("🚀 ~ getUniversities ~ response:", response.data)
  return response.data;
};

export const universityCourse = async (universityAdmissionApiKey) => {
  const response = await apiAuthClient.get(`/GetCourses/${universityAdmissionApiKey}/`);
  return response.data;
};
export const universitySubCourse = async (SubCoursesAPIKey) => {
  const response = await apiAuthClient.get(`/GetSubCourses/${SubCoursesAPIKey}/`);
  return response.data;
};