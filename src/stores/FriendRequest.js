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

    const acceptRequest = (friendRequestId) => {
        return globalStore.actionWrapper(async () => {
            const res =
                await FriendRequestService.acceptRequest(friendRequestId);
            return res.data;
        });
    };

    const cancelRequest = (friendId) => {
        return globalStore.actionWrapper(async () => {
            const res = await FriendRequestService.removeFriend(friendId);
            return res.data;
        });
    };

    const getMyRequests = () => {
        return globalStore.actionWrapper(async () => {
            const res = await FriendRequestService.getMyRequests();
            return res.data;
        });
    };

    const removeFriend = (friendId) => {
        return globalStore.actionWrapper(async () => {
            const res = await FriendRequestService.removeFriend(friendId);
            globalStore.showSuccess(
                'Friend removed',
                'Friend removed successfully'
            );
            return res.data;
        });
    };

    const deleteFriendRequest = (friendId) => {
        return globalStore.actionWrapper(async () => {
            const res = await FriendRequestService.removeFriend(friendId);
            globalStore.showSuccess(
                'Friend Request deleted',
                'Friend Request deleted successfully'
            );
            return res.data;
        });
    };

    return {
        sendRequest,
        acceptRequest,
        cancelRequest,
        getMyRequests,
        removeFriend,
        deleteFriendRequest
    };
});
