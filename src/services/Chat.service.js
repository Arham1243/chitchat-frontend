import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getConversations = () => {
    return AxiosService.get(`${BASE_URL}/chat`);
};
export const getMessages = (userId) => {
    return AxiosService.get(`${BASE_URL}/chat/${userId}`);
};
export const sendMessage = (recipientId, payload) => {
    return AxiosService.post(`${BASE_URL}/chat/${recipientId}`, payload);
};
