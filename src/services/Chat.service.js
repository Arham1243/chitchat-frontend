import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getConversations = () => {
    return AxiosService.get(`${BASE_URL}/chat`);
};
export const markMessagesAsRead = (conversationId, payload) => {
    return AxiosService.post(
        `${BASE_URL}/chat/messages/${conversationId}/read`,
        payload
    );
};

export const getMessages = (username) => {
    return AxiosService.get(`${BASE_URL}/chat/${username}`);
};
export const sendMessage = (recipientId, payload) => {
    return AxiosService.post(`${BASE_URL}/chat/${recipientId}`, payload);
};
