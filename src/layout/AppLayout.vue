<script setup>
import Header from '@/layout/Header.vue';
import AppMenu from '@/layout/AppMenu.vue';
import Loader from '@/components/common/Loader.vue';
import { onBeforeMount, ref } from 'vue';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const loading = ref(true);

const toggleTheme = () => {
    const dark = localStorage.getItem('darkMode');
    if (dark === '1') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
onBeforeMount(async () => {
    toggleTheme();
    await authStore.me();
    loading.value = false;
});
</script>
<template>
    <div
        class="w-screen h-screen flex justify-content-center align-items-center"
        v-if="loading"
    >
        <Loader />
    </div>
    <div class="main" v-else>
        <Header />

        <div class="first-section-padding">
            <div class="grid grid-nogutter">
                <div class="col-3">
                    <AppMenu />
                </div>
                <router-view />
            </div>
        </div>
        <ConfirmDialog class="confirm-dialog" />
        <Toast />
    </div>
</template>
<style>
.main {
    min-width: 100vw;
    min-height: 100vh;
    background: var(--main-bg);
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 100ms ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
