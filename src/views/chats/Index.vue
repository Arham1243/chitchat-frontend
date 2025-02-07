<script setup>
import { useRoute } from 'vue-router';
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import Logo from '@/assets/images/logo.png';
import useEventsBus from '@/utils/event-bus';
import helpers from '@/utils/helpers';
import { useAuthStore, useChatStore } from '@/stores';
import { echo } from '@/plugins/echo';

const chatStore = useChatStore();
const { emit } = useEventsBus();
const authStore = useAuthStore();
const route = useRoute();
const user = ref({});
const currentUser = computed(() => authStore.currentUser);
const message = ref('');
const messages = ref([]);
const conversationId = ref('');
const repliesContainer = ref(null);

onBeforeMount(() => {
    setCurrentChat();
    scrollToBottom();
});

onBeforeMount(() => {
    setCurrentChat();
    markMessageAsRead();
});

onMounted(async () => {
    echo.channel('messages').listen('.new', async (data) => {
        emit('reloadMessages');
        await getMessages(route.params.username);
        if (data.sender_id !== currentUser.value.id) {
            newMessageReceived();
        }
        await markMessageAsRead(data.conversation_id);
        scrollToBottom();
    });

    echo.channel('messages').listen('.read', async () => {
        emit('reloadMessages');
        await getMessages(route.params.username);
        scrollToBottom();
    });
});

onMounted(async () => {
    echo.channel('messages').listen('.new', async (data) => {
        emit('reloadMessages');
        await getMessages(route.params.username);
        await markMessageAsRead(data.conversation_id);
        scrollToBottom();
    });

    echo.channel('messages').listen('.read', async () => {
        emit('reloadMessages');
        await getMessages(route.params.username);
        scrollToBottom();
    });
});

watch(
    () => route.params.username,
    (newUsername) => {
        if (newUsername) {
            setCurrentChat();
            markMessageAsRead(conversationId.value);
            scrollToBottom();
        }
    }
);

const markMessageAsRead = async (conversationId) => {
    try {
        const otherUserMessages = messages.value.filter(
            (message) => message.sender_id !== currentUser.value.id
        );
        const unreadMessageIds = otherUserMessages
            .filter((message) => message.read_at === null)
            .map((message) => message.id);
        if (unreadMessageIds.length > 0) {
            await chatStore.markMessagesAsRead(conversationId, {
                messagesIds: unreadMessageIds
            });
            emit('reloadMessages');
        }
    } catch (error) {
        console.error('Error marking message as read', error);
    }
};

const getMessages = async (username) => {
    try {
        const res = await chatStore.getMessages(username);
        conversationId.value = res.conversation.id || {};
        user.value = res.recipient || {};
        messages.value = res.messages || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

const sendMessage = async () => {
    if (!message.value.trim()) return;
    try {
        const payload = { message: message.value.trim() };
        await chatStore.sendMessage(user.value.id, payload);
        messages.value.push({
            sender_id: currentUser.value.id,
            message: message.value,
            created_at: new Date().toISOString()
        });
        scrollToBottomSmoothly();
        message.value = '';
        emit('reloadMessages');
        await getMessages(route.params.username);
    } catch (error) {
        console.error(error);
    }
};

const setCurrentChat = async () => {
    try {
        const foundUser = chatStore.currentUserChat;
        conversationId.value = foundUser.conversation
            ? foundUser.conversation.id
            : foundUser.id;
        user.value = foundUser?.recipient || {};
        messages.value = foundUser?.messages || [];
    } catch (error) {
        console.error(error);
    }
};

const scrollToBottom = async () => {
    await nextTick();
    if (repliesContainer.value) {
        repliesContainer.value.scrollTo({
            top: repliesContainer.value.scrollHeight
        });
    }
};
const scrollToBottomSmoothly = async () => {
    await nextTick();
    if (repliesContainer.value) {
        repliesContainer.value.scrollTo({
            top: repliesContainer.value.scrollHeight,
            behavior: 'smooth'
        });
    }
};
</script>

<template>
    <div v-if="route.params.username === '-1'">
        <div
            class="w-full h-screen flex justify-content-center align-items-center"
        >
            <div class="grid w-full justify-content-center">
                <div class="text-center mb-4">
                    <img :src="Logo" width="145" class="logo mb-2" alt="logo" />
                    <div class="text-2xl font-semibold heading mb-1">
                        Stay Connected Effortlessly
                    </div>
                    <div class="text-sm font-medium para">
                        Send and receive messages anytime, without
                        interruptions.
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="chat-header">
            <div class="chat-profile flex items-center" v-if="user">
                <router-link
                    :to="{
                        name: 'user-detail',
                        params: { username: user.username }
                    }"
                    class="avatar"
                >
                    <img
                        :src="user.profile_picture"
                        :alt="user.name"
                        width="45"
                        height="45"
                        class="border-circle"
                    />
                </router-link>
                <div class="content">
                    <div class="name">{{ user.name }}</div>
                    <div class="status">
                        {{ user.is_online ? 'Online' : 'Offline' }}
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-screen">
            <div class="replies" v-if="messages.length" ref="repliesContainer">
                <div
                    class="reply"
                    :class="{ my: conversation.sender_id === currentUser.id }"
                    v-for="(conversation, index) in messages"
                    :key="index"
                >
                    <div class="text">{{ conversation.message }}</div>
                    <div class="flex align-items-end gap-2">
                        <div class="time">
                            {{ helpers.formatTime(conversation.created_at) }}
                        </div>
                        <i
                            v-if="conversation.sender_id === currentUser.id"
                            :class="[
                                'bx',
                                'bx-check-double',
                                { seen: conversation.read_at }
                            ]"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="message-box flex align-items-center">
            <form
                @submit.prevent="sendMessage"
                class="flex align-items-center justify-content-between w-full pr-3"
            >
                <InputText
                    v-model="message"
                    type="text"
                    placeholder="Type a message"
                    class="text-sm message-input w-full"
                />
                <Button
                    size="small"
                    style="
                        padding: 0 !important;
                        --p-button-icon-only-width: 2.1rem;
                    "
                    type="submit"
                    icon="fa-solid fa-arrow-right"
                    rounded
                    :disabled="message.length < 1"
                />
            </form>
        </div>
    </div>
</template>

<style>
.chat-screen {
    height: calc(100vh - 7.5rem);
    overflow: hidden;
    position: relative;
    background: var(--chat-bg);
    isolation: isolate;
    padding: 1rem 0 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.replies {
    overflow-y: auto;
}
.message-box {
    background: var(--header-bg);
    padding: 0.5rem 0.7rem;
    border-top: 1px solid var(--header-shadow);
}
.message-box .actions button .p-button-icon {
    color: var(--icon-color);
}
.message-input {
    color: var(--text-color) !important;
    flex: 1;
    width: 100%;
    font-size: 0.8rem;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
}
.message-input::placeholder {
    color: var(--text-placeholder-color) !important;
}
.chat-header {
    background: var(--header-bg);
    border-bottom: 1px solid var(--header-shadow);
    padding: 0.5rem 1.5rem;
}
.chat-profile {
    display: flex;
    align-items: center;
    gap: 0.85rem;
}

.chat-profile .name {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 2px;
}
.chat-profile .status {
    color: var(--text-gray-color);
    font-size: 0.75rem;
    font-weight: 500;
}
.heading {
    color: var(--text-color);
}
.para {
    color: var(--text-gray-color);
}
.reply {
    border: 1px solid var(--header-shadow);
    background: var(--reply-bg);
    width: fit-content;
    padding: 0.45rem 0.5rem;
    border-radius: 0.65rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: flex-end;
    border-top-left-radius: 0;
    gap: 1rem;
    margin-left: 2rem;
}

.reply.my {
    margin-left: auto;
    border-top-right-radius: 0;
    background: var(--my-reply-bg);
    border-color: transparent;
    margin-right: 2rem;
}

.reply .text {
    font-size: 0.83rem;
    margin-bottom: 2px;
}

.reply .time {
    font-size: 0.65rem;
    font-weight: 300;
}
.reply i {
    font-size: 1.01rem;
}
.reply i.seen {
    color: #007bfc;
}
</style>
