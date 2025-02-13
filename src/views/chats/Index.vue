<script setup>
import { useRoute, useRouter } from 'vue-router';
import {
    computed,
    nextTick,
    onBeforeMount,
    onMounted,
    onUnmounted,
    ref,
    watch
} from 'vue';
import Logo from '@/assets/images/logo.png';
import useEventsBus from '@/utils/event-bus';
import helpers from '@/utils/helpers';
import { useAuthStore, useChatStore } from '@/stores';
import { echo } from '@/plugins/echo';

const chatStore = useChatStore();
const { emit } = useEventsBus();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const user = ref({});
const currentUser = computed(() => authStore.currentUser);
const message = ref('');
const messages = ref([]);
const conversationId = ref('');
const repliesContainer = ref(null);
const showSuggestions = ref(false);
const suggestions = ref([]);
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const sendingMessage = ref(false);

onBeforeMount(() => {
    setCurrentChat();
    getSuggestions();
    markMessageAsRead(conversationId.value);
    scrollToBottom();
});

if (route.name === 'chats' && route.params.username) {
    let messagesChannel;
    let usersChannel;

    onMounted(() => {
        messagesChannel = echo.channel('messages');
        usersChannel = echo.channel('users');

        messagesChannel.listen('.new', async (data) => {
            try {
                emit('reloadMessages');
                await getMessages(route.params.username);
                await markMessageAsRead(data.conversation_id);
                await getSuggestions();
                scrollToBottom();
            } catch (error) {
                console.error('Error in .new event listener:', error);
            }
        });

        messagesChannel.listen('.read', async () => {
            try {
                emit('reloadMessages');
                await getMessages(route.params.username);
                scrollToBottom();
            } catch (error) {
                console.error('Error in .read event listener:', error);
            }
        });

        usersChannel
            .listen('.user.logged.in', async (data) => {
                try {
                    if (data.user_id === user.value.id) {
                        user.value.is_online = 'Online';
                    }
                    emit('reloadMessages');
                    await getMessages(route.params.username);
                } catch (error) {
                    console.error(
                        'Error in .user.logged.in event listener:',
                        error
                    );
                }
            })
            .listen('.user.logged.out', async (data) => {
                try {
                    if (data.user_id === user.value.id) {
                        user.value.is_online = 'Offline';
                    }
                    emit('reloadMessages');
                    await getMessages(route.params.username);
                } catch (error) {
                    console.error(
                        'Error in .user.logged.out event listener:',
                        error
                    );
                }
            });
    });

    onUnmounted(() => {
        if (messagesChannel) {
            echo.leaveChannel('messages');
        }
        if (usersChannel) {
            echo.leaveChannel('users');
        }
    });
}

watch(
    () => route.params.username,
    (newUsername) => {
        if (newUsername) {
            setCurrentChat();
            markMessageAsRead(conversationId.value);
            scrollToBottom();
            getSuggestions();
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
        console.error(error);
    }
};

import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
});

const getSuggestions = async () => {
    try {
        if (
            messages.value.length > 20 &&
            messages.value[messages.value.length - 1]?.sender_id ===
                user.value.id
        ) {
            const promptContext = `Below is a conversation between two individuals: ${user.value.name} and ${currentUser.value.name}. Analyze their previous interactions and generate at least three one-liner minimal responses maximumm 5 to 6 words only from ${user.value.name} that mirror the tone, style, words, and phrasing typically used by ${currentUser.value.name}. Ensure the responses align with ${currentUser.value.name}'s established manner in past conversations. dont use bullets/counting and etc in response just 3 messaged seprated with |.`;

            const conversation = messages.value
                .map(
                    (message) =>
                        `${message.sender_id === currentUser.value.id ? currentUser.value.name : user.value.name}: ${message.message}`
                )
                .join('\n');

            const prompt = `${promptContext} \n\nCONVERSATION BETWEEN ${user.value.name} and ${currentUser.value.name}:\n\n${conversation}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: prompt
                    },
                    {
                        role: 'user',
                        content: promptContext
                    }
                ],
                store: true
            });
            scrollToBottomSmoothly();
            showSuggestions.value = true;
            suggestions.value =
                completion.choices[0].message.content.split('|');
        }
    } catch (error) {
        console.error(error);
    }
};

const sendMessage = async (userMessage) => {
    if (!userMessage.trim() && sendingMessage.value) return;
    try {
        sendingMessage.value = true;
        showSuggestions.value = false;
        messages.value.push({
            sender_id: currentUser.value.id,
            message: userMessage,
            created_at: new Date().toISOString()
        });
        message.value = '';
        scrollToBottomSmoothly();
        const payload = { message: userMessage.trim() };
        await chatStore.sendMessage(user.value.id, payload);
        scrollToBottomSmoothly();
        emit('reloadMessages');
        await getMessages(route.params.username);
    } catch (error) {
        console.error(error);
    } finally {
        sendingMessage.value = false;
    }
};

const setCurrentChat = async () => {
    try {
        const foundUser = chatStore.currentUserChat;
        conversationId.value = foundUser
            ? foundUser.conversation
                ? foundUser.conversation.id
                : foundUser.id
            : null;
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
            class="w-full h-screen flex justify-content-center align-items-center mb-hidden"
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
                <Button
                    @click="
                        router.push({
                            name: 'chats',
                            params: { username: '-1' }
                        })
                    "
                    icon="icon pi pi-arrow-left"
                    variant="text"
                    rounded
                    class="text-black-alpha-90 back-btn mb-show"
                />
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
                        {{ user.is_online ? 'Online' : '' }}
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
            <div
                class="suggestions flex justify-content-end gap-2 mt-4 mb-1 mr-5 pr-2 w-fit ml-auto"
                v-if="suggestions.length > 2 && showSuggestions"
            >
                <Button
                    v-for="(suggestion, index) in suggestions"
                    :key="index"
                    @click="sendMessage(suggestion, true)"
                    class="text-xs"
                    :label="suggestion"
                    variant="outlined"
                    size="small"
                />
            </div>
        </div>

        <form
            @submit.prevent="sendMessage(message)"
            class="message-box flex align-items-center justify-content-between w-full pr-3"
        >
            <InputText
                v-model="message"
                type="text"
                placeholder="Type a message"
                class="text-sm message-input w-full"
            />
            <Button
                type="submit"
                :disabled="message.length < 1"
                icon="icon pi pi-arrow-right"
                variant="text"
                rounded
                class="text-black-alpha-90 back-btn"
            />
        </form>
    </div>
</template>

<style>
.chat-screen {
    height: calc(100vh - 123px);
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
    padding: 0 0.7rem;
    border-top: 1px solid var(--header-shadow);
}
body .message-box .back-btn {
    --p-button-icon-only-width: 2.75rem;
    border-radius: 0.5rem;
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
    padding: 0 1rem !important;
    height: 57px;
}
.message-input::placeholder {
    color: var(--text-placeholder-color) !important;
}
.chat-header {
    background: var(--header-bg);
    border-bottom: 1px solid var(--header-shadow);
    padding: 0.5rem 1.5rem;
    height: 66px;
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
    max-width: 50%;
    line-height: 1.3;
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
    width: max-content;
}
.reply i {
    font-size: 1.01rem;
}
.reply i.seen {
    color: #007bfc;
}
</style>
