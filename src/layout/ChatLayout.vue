<script setup>
import ChatMenu from '@/layout/ChatMenu.vue';
import { useChatStore, useAuthStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Loader from '@/components/common/Loader.vue';

const authStore = useAuthStore();
const chatStore = useChatStore();
const route = useRoute();
const loading = ref(true);

onMounted(async () => {
    toggleTheme();
    await authStore.me();
    if (route.params.username !== '-1') {
        getMessages(route.params.username);
    } else {
        loading.value = false;
    }
});

const toggleTheme = () => {
    const dark = localStorage.getItem('darkMode');
    if (dark === '1') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const getMessages = async (username) => {
    try {
        const res = await chatStore.getMessages(username);
        chatStore.setCurrentChatUser(res);
    } catch (error) {
        console.error('Error fetching messages:', error);
    } finally {
        loading.value = false;
    }
};
</script>
<template>
    <div
        class="w-screen h-screen flex justify-content-center align-items-center"
        v-if="loading"
    >
        <Loader />
    </div>
    <div class="grid grid-nogutter" v-else>
        <div class="col-12 lg:col-3">
            <ChatMenu />
        </div>
        <div class="col-12 lg:col-9">
            <router-view />
        </div>
    </div>
</template>
<style></style>
