import { defineStore } from 'pinia';
import { NotificationService } from '@/services';
import { useGlobalStore } from '@/stores';

export const useNotificationStore = defineStore('NotificationStore', () => {
    const globalStore = useGlobalStore();

    const getNotifications = () => {
        return globalStore.actionWrapper(async () => {
            const res = await NotificationService.getNotifications();
            return res.data;
        });
    };
    const getUnreadNotifications = () => {
        return globalStore.actionWrapper(async () => {
            const res = await NotificationService.getUnreadNotifications();
            return res.data;
        });
    };
    const markAsRead = (id) => {
        return globalStore.actionWrapper(async () => {
            const res = await NotificationService.markAsRead(id);
            return res.data;
        });
    };

    return {
        getNotifications,
        getUnreadNotifications,
        markAsRead
    };
});
