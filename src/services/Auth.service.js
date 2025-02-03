import AxiosService from './Axios.service';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const login = (payload) => {
    return AxiosService.post(`${BASE_URL}/login`, payload);
};
export const register = (payload) => {
    return AxiosService.post(`${BASE_URL}/register`, payload);
};
export const logout = () => {
    return AxiosService.post(`${BASE_URL}/logout`);
};
export const forgetPassword = (payload) => {
    return AxiosService.post(`${BASE_URL}/password/forget`, payload);
};
export const resetPassword = (payload) => {
    return AxiosService.post(`${BASE_URL}/password/reset`, payload);
};
export const loginWithGoogle = () => {
    return AxiosService.post(`${BASE_URL}/google/redirect`);
};
export const me = () => {
    return AxiosService.get(`${BASE_URL}/me`);
};
