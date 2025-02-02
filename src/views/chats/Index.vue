<script setup>
import { useRoute } from 'vue-router';
import Logo from '@/assets/images/logo.png';
import chats from '@/mocks/chats.json';
import { computed } from 'vue';
const route = useRoute();

const userChat = {
    full_name: 'John Doe',
    username: 'john_doe',
    last_message: "Hey, how's it going?",
    is_last_message_seen: false,
    last_message_date: '2025-02-03',
    profile_picture: '/src/assets/images/placeholder-user.png'
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
                <div class="name">{{ userChat.full_name }}</div>
            </div>
        </div>
        <div class="chat-screen"></div>
        <div class="message-box flex align-items-center">
            <div class="actions">
                <Button
                    icon="fa-regular fa-face-smile"
                    variant="text"
                    class="text-black-alpha-90 back-btn"
                />
                <Button
                    icon="fa-solid fa-paperclip"
                    variant="text"
                    class="text-black-alpha-90 back-btn"
                />
            </div>
            <InputText
                name="message"
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
}
.heading {
    color: var(--text-color);
}
.para {
    color: var(--text-gray-color);
}
</style>
