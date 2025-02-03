import { defineStore } from 'pinia';
import { AuthService } from '@/services';
import { useGlobalStore, useSessionStore } from '@/stores';
import { ref } from 'vue';

export const useAuthStore = defineStore('AuthStore', () => {
    const globalStore = useGlobalStore();
    const currentUser = ref({});
    const sessionStore = useSessionStore();

    const login = (payload) => {
        return globalStore.actionWrapper(async () => {
            try {
                const res = await AuthService.login(payload);
                sessionStore.startUserSession(res.data);
                return res.data;
            } catch (error) {
                globalStore.showError('Error', error.response.data.message);
            }
        });
    };
    const loginUser = (payload) => {
        sessionStore.startUserSession(payload);
    };

    const register = (payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await AuthService.register(payload);
            sessionStore.startUserSession(res.data);
            return res.data;
        });
    };

    const logout = () => {
        return globalStore.actionWrapper(async () => {
            const res = await AuthService.logout();
            sessionStore.clearSessionState();
            return res.data;
        });
    };

    const forgetPassword = (payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await AuthService.forgetPassword(payload);
            globalStore.showSuccess('Password Reset', res.data.message);
            return res.data;
        });
    };

    const resetPassword = (payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await AuthService.resetPassword(payload);
            globalStore.showSuccess('Password Reset', res.data.message);
            return res.data;
        });
    };

    const loginWithGoogle = () => {
        return globalStore.actionWrapper(async () => {
            try {
                const res = await AuthService.loginWithGoogle();
                return res.data;
            } catch (error) {
                globalStore.showError('Error', error.response.data.message);
            }
        });
    };

    const me = () => {
        return globalStore.actionWrapper(async () => {
            const res = await AuthService.me();
            currentUser.value = res.data;
            return res.data;
        });
    };

    return {
        currentUser,
        login,
        loginUser,
        register,
        logout,
        forgetPassword,
        resetPassword,
        loginWithGoogle,
        me
    };
});
