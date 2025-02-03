import { defineStore } from 'pinia';
import { useCookies } from 'vue3-cookies';

export const useSessionStore = defineStore('SessionStore', () => {
    const { cookies } = useCookies();

    const startUserSession = (data) => {
        const date = new Date();
        const authCookie = getCookie() || {};
        authCookie.access_token = data.access_token;
        authCookie.expires_in = date.setSeconds(
            date.getSeconds() + data.expires_in
        );

        setCookie(authCookie);
    };

    const clearSessionState = () => {
        cookies.remove('chitchat_cookie', null);
    };

    const setCookie = (value) => {
        cookies.set('chitchat_cookie', value);
    };

    const getCookie = () => {
        return cookies.get('chitchat_cookie');
    };

    return {
        startUserSession,
        clearSessionState,
        setCookie,
        getCookie
    };
});
