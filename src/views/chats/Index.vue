<script setup>
import { useRoute } from 'vue-router';
import { onBeforeMount, ref, watch } from 'vue';
import Logo from '@/assets/images/logo.png';
import helpers from '@/utils/helpers';
import chats from '@/mocks/chats.json';

const message = ref('');
const route = useRoute();
const userChat = ref({});

onBeforeMount(() => {
    fetchChat();
});
watch(
    () => route.params.username,
    () => {
        fetchChat();
    }
);

const fetchChat = () => {
    userChat.value = chats.find((u) => u.username === route.params.username);
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
            <div class="chat-profile">
                <div class="avatar">
                    <img
                        .src="userChat.profile_picture"
                        :alt="userChat.full_name"
                        width="45"
                        height="45"
                        class="border-circle"
                    />
                </div>
                <div class="content">
                    <div class="name">{{ userChat.full_name }}</div>
                    <div class="status">{{ userChat.user_status }}</div>
                </div>
            </div>
        </div>
        <div class="chat-screen">
            <div class="replies">
                <div
                    class=""
                    :class="['reply', { my: !conversation.is_current_user }]"
                    v-for="(conversation, index) in userChat.conversations"
                    :key="index"
                >
                    <template v-if="conversation.type === 'text'">
                        <div class="text">{{ conversation.message }}</div>
                        <div class="flex align-items-end gap-2">
                            <div class="time">
                                {{ helpers.formatTime(conversation.date) }}
                            </div>
                            <i
                                :class="[
                                    'bx',
                                    'bx-check-double',
                                    { seen: conversation.is_seen }
                                ]"
                            ></i>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="message-box flex align-items-center">
            <!-- <div class="actions">
                <Button
                    icon="fa-regular fa-face-smile"
                    variant="text"
                    class="text-black-alpha-90 back-btn"
                />
            </div> -->
            <InputText
                v-model="message"
                type="text"
                placeholder="Type a message"
                class="text-sm message-input"
            />
        </div>
    </div>
</template>
<style>
.chat-screen {
    height: calc(100vh - 7.25rem);
    overflow-y: auto;
    position: relative;
    background: var(--chat-bg);
    isolation: isolate;
    padding: 1rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.message-box {
    background: var(--header-bg);
    padding: 0.35rem 0.7rem;
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
}

.reply.my {
    margin-left: auto;
    border-top-right-radius: 0;
    background: var(--my-reply-bg);
    border-color: transparent;
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
