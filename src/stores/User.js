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

    const getFriends = () => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.getFriends();
            users.value = res.data;
            return res.data;
        });
    };

    const getOnlineFriends = () => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.getOnlineFriends();
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
    const updateProfilePicture = (payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await UserService.updateProfilePicture(payload);
            globalStore.showSuccess(
                'Picture updated',
                'Profiel Picture updated successfully'
            );
            return res.data;
        });
    };

    return {
        getUsers,
        searchUsers,
        getUser,
        onlineUsers,
        updateProfilePicture,
        getOnlineUsers,
        users,
        getFriends,
        getOnlineFriends
    };
});
