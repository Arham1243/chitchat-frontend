<script setup>
import Logo from '@/assets/images/logo.png';
import { onMounted } from 'vue';
onMounted(() => {
    document.documentElement.classList.remove('dark');
});
</script>

<template>
    <div
        class="w-screen h-screen flex justify-content-center align-items-center"
    >
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
    <Toast />
</template>

<style scoped>
.auth-wrapper {
    width: 303px;
}
</style>
