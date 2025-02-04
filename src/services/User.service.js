import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const searchUsers = (payload) => {
    return AxiosService.post(`${BASE_URL}/users/search`, payload);
};
export const getUsers = () => {
    return AxiosService.get(`${BASE_URL}/users`);
};
export const getUser = (username) => {
    return AxiosService.get(`${BASE_URL}/users/${username}`);
};
export const getOnlineUsers = (payload) => {
    return AxiosService.get(`${BASE_URL}/users`, payload);
};
