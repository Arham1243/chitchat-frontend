<script setup>
import ChatMenu from '@/layout/ChatMenu.vue';
import { useChatStore, useUserStore, useAuthStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Loader from '@/components/common/Loader.vue';

const authStore = useAuthStore();
const chatStore = useChatStore();
const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);

onMounted(async () => {
    toggleTheme();
    await authStore.me();
    if (route.params.username !== '-1') {
        fetchUser();
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

const fetchUser = async () => {
    try {
        loading.value = true;
        const res = await userStore.getUser(route.params.username);
        chatStore.setCurrentChatUser(res);
    } catch (error) {
        console.log(error);
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
        <div class="col-3">
            <ChatMenu />
        </div>
        <div class="col-9">
            <router-view />
        </div>
    </div>
</template>
<style></style>
