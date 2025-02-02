<script setup>
import chats from '@/mocks/chats.json';
import helpers from '@/utils/helpers';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
    <div class="flex align-items-center gap-3 px-3 py-3">
        <Button
            @click="router.push({ name: 'home' })"
            icon="icon pi pi-arrow-left"
            variant="text"
            rounded
            class="text-black-alpha-90 back-btn"
        />
        <div class="page-title page-title--lg mb-1">Chats</div>
    </div>
    <div class="px-3 pb-3">
        <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
                v-model="value1"
                placeholder="Search"
                class="global-search"
            />
        </IconField>
    </div>
    <div class="chats-wrapper">
        <Menu :model="chats" class="bg-transparent border-none">
            <template #item="{ item }">
                <router-link :to="item.username" v-ripple class="w-full chat">
                    <div class="chat-avatar">
                        <img
                            :src="item.profile_picture"
                            :alt="item.full_name"
                            width="30"
                            height="30"
                            class="border-circle"
                        />
                    </div>
                    <div class="chat-content">
                        <div class="wrapper">
                            <div class="name">{{ item.full_name }}</div>
                            <div class="date">
                                {{ helpers.formatDate(item.last_message_date) }}
                            </div>
                        </div>
                        <div class="message">
                            <i class="bx bx-check-double"></i>
                            <div class="text">
                                {{ item.last_message }}
                            </div>
                        </div>
                    </div>
                </router-link>
            </template>
        </Menu>
    </div>
</template>
<style>
.chats-wrapper {
    height: 78vh;
    overflow-y: auto;
}
.chats-wrapper::-webkit-scrollbar {
    width: 3px;
}
.p-menu-list {
    gap: 0 !important;
}
.chat {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.95rem;
    padding: 0.75rem 1.25rem;
}

.chat-avatar {
    width: 60px;
    border-radius: 100%;
    overflow: hidden;
}

.chat-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.chat-content .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chat-content {
    width: 100%;
}

.chat-content .name {
    color: var(--text-color);
    font-size: 0.95rem;
    font-weight: 500;
}

.chat-content .message {
    display: flex;
    align-items: center;
    gap: 0.15rem;
}
.chat-content .message .text {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-gray-color);
}

.chat-content .message i {
    font-size: 1.3rem;
    color: var(--text-gray-color);
}
.chat-content .date {
    color: var(--text-gray-color);
    font-size: 0.85rem;
    font-weight: 500;
}
</style>
