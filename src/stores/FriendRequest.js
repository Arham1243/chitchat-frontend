import { defineStore } from 'pinia';
import { FriendRequestService } from '@/services';
import { useGlobalStore } from '@/stores';

export const useFriendRequestStore = defineStore('FriendRequestStore', () => {
    const globalStore = useGlobalStore();

    const sendRequest = (payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await FriendRequestService.sendRequest(payload);
            globalStore.showSuccess('Friend Request Sent', res.data.message);
            return res.data;
        });
    };
    return {
        sendRequest
    };
});
