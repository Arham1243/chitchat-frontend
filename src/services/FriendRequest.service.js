import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const sendRequest = (payload) => {
    return AxiosService.post(`${BASE_URL}/friend-requests`, payload);
};
