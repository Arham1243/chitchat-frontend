import { defineStore } from 'pinia';
import { UserService } from '@/services';
import { useGlobalStore } from '@/stores';
import { ref } from 'vue';

export const useUserStore = defineStore('UserStore', () => {
    const users = ref();
    const onlineUsers = ref();
    const globalStore = useGlobalStore();

    const searchUsers = (payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.searchUsers(payload);
            users.value = res.data;
            return res.data;
        });
    };

    const getUsers = () => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.getUsers();
            users.value = res.data;
            return res.data;
        });
    };

    const getUser = (username) => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.getUser(username);
            users.value = res.data;
            return res.data;
        });
    };

    const getOnlineUsers = () => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.getOnlineUsers();
            onlineUsers.value = res.data;
            return res.data;
        });
    };

    return {
        getUsers,
        searchUsers,
        getUser,
        onlineUsers,
        getOnlineUsers,
        users
    };
});
