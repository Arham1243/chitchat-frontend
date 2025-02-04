import axios from 'axios';
import { useSessionStore } from '@/stores';
import { useRouter } from 'vue-router';

const axiosApi = axios.create({
    headers: {
        Accept: 'application/json'
    }
});
axiosApi.interceptors.request.use(
    async (config) => {
        const sessionStore = useSessionStore();
        const authCookie = sessionStore.getCookie() || {};
        const { access_token } = authCookie;
        config.headers['authorization'] = `Bearer ${access_token}`;
        config.headers['accept-language'] = 'en';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const router = useRouter();
            const sessionStore = useSessionStore();
            sessionStore.clearSessionState();
            router.push({ name: 'login' });
        }
        return Promise.reject(error);
    }
);

export default axiosApi;
