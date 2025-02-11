import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const API_KEY = `${import.meta.env.VITE_OPENAI_API_KEY}`;

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

export const getSuggestions = (message) => {
    return AxiosService.post(
        `https://api.openai.com/v1/chat/completions`,
        {
            model: 'gpt-4o',
            messages: message,
            api_key: API_KEY
        },
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
};

export const sendMessage = (recipientId, payload) => {
    return AxiosService.post(`${BASE_URL}/chat/${recipientId}`, payload);
};
export const getUnreadMessages = () => {
    return AxiosService.get(`${BASE_URL}/chat/messages/unread`);
};
