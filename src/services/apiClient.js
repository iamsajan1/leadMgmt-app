import axios from "axios";


const apiClient = axios.create({
    baseURL:"http://209.182.232.141:9092/api/v1"
});

export default apiClient;
