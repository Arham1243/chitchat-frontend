import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getNotifications = () => {
    return AxiosService.get(`${BASE_URL}/notifications`);
};
export const getUnreadNotifications = () => {
    return AxiosService.get(`${BASE_URL}/notifications/unread`);
};
export const markAsRead = (id) => {
    return AxiosService.post(`${BASE_URL}/notifications/${id}/mark-as-read`);
};
