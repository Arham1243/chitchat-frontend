import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const sendRequest = (payload) => {
    return AxiosService.post(`${BASE_URL}/friend-requests`, payload);
};
export const acceptRequest = (friendRequestId) => {
    return AxiosService.put(
        `${BASE_URL}/friend-requests/${friendRequestId}/accept`
    );
};
export const getMyRequests = () => {
    return AxiosService.get(`${BASE_URL}/friends/requests/received`);
};

export const removeFriend = (friendId) => {
    return AxiosService.delete(`${BASE_URL}/friends/${friendId}`);
};
