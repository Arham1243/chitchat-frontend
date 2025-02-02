<script setup>
import ChatMenu from '@/layout/ChatMenu.vue';
import { onMounted } from 'vue';
const toggleTheme = () => {
    const dark = localStorage.getItem('darkMode');
    if (dark === '1') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
onMounted(() => {
    toggleTheme();
});
</script>
<template>
    <div class="grid grid-nogutter">
        <div class="col-3">
            <ChatMenu />
        </div>
        <div class="col-9">
            <router-view />
        </div>
    </div>
</template>
<style></style>
