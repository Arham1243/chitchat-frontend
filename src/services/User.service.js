import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getOnlineFriends = () => {
    return AxiosService.get(`${BASE_URL}/friends`);
};
export const getFriends = () => {
    return AxiosService.get(`${BASE_URL}/friends`);
};
export const searchUsers = (payload) => {
    return AxiosService.post(`${BASE_URL}/users/search`, payload);
};
export const updateProfilePicture = (payload) => {
    return AxiosService.post(`${BASE_URL}/update-profile-picture`, payload);
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
