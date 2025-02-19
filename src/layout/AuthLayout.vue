<script setup>
import Logo from '@/assets/images/logo.png';
import { onMounted } from 'vue';
onMounted(() => {
    document.documentElement.classList.remove('dark');
});
</script>

<template>
    <div class="w-screen auth-main flex justify-content-center align-items-center">
        <div class="grid w-full justify-content-center">
            <div class="auth-wrapper">
                <div class="text-center mb-4">
                    <img :src="Logo" width="180" class="logo" alt="logo" />
                </div>
                <div class="auth-box border-round-lg text-color">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
    <div class="px-3 py-4 auth-footer">
        <div class="flex gap-3 justify-content-center">
            <a href="https://github.com/Arham1243/chitchat-frontend" target="_blank" rel="noopener noreferrer"
                v-tooltip.bottom="`ChitChat Frontend`">
                <Button icon="icon pi pi-github" variant="outlined" rounded />
            </a>
            <a href="https://github.com/Arham1243/chitchat-backend" target="_blank" rel="noopener noreferrer"
                v-tooltip.bottom="`ChitChat Backend`">
                <Button icon="icon pi pi-github" variant="outlined" rounded />
            </a>
        </div>
    </div>
    <Toast />
</template>

<style scoped>
.auth-wrapper {
    width: 303px;
}
.auth-main{
    min-height: 93vh;
}
</style>
