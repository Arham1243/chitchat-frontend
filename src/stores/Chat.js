import { defineStore } from 'pinia';
import { ChatService } from '@/services';
import { useGlobalStore } from '@/stores';
import { ref } from 'vue';

export const useChatStore = defineStore('ChatStore', () => {
    const currentUserChat = ref(null);
    const globalStore = useGlobalStore();

    const getConversations = () => {
        return globalStore.actionWrapper(async () => {
            const res = await ChatService.getConversations();
            return res.data;
        });
    };

    const getMessages = (username) => {
        return globalStore.actionWrapper(async () => {
            const res = await ChatService.getMessages(username);
            return res.data;
        });
    };

    const getSuggestions = (message) => {
        return globalStore.actionWrapper(async () => {
            const res = await ChatService.getSuggestions(message);
            return res.data;
        });
    };

    const sendMessage = (recipientId, payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await ChatService.sendMessage(recipientId, payload);
            return res.data;
        });
    };

    const markMessagesAsRead = (conversationId, payload) => {
        return globalStore.actionWrapper(async () => {
            const res = await ChatService.markMessagesAsRead(
                conversationId,
                payload
            );
            return res.data;
        });
    };
    const getUnreadMessages = () => {
        return globalStore.actionWrapper(async () => {
            const res = await ChatService.getUnreadMessages();
            return res.data;
        });
    };

    const setCurrentChatUser = (user) => {
        currentUserChat.value = user;
    };
    return {
        getConversations,
        markMessagesAsRead,
        sendMessage,
        currentUserChat,
        getUnreadMessages,
        setCurrentChatUser,
        getMessages,
        getSuggestions
    };
});
