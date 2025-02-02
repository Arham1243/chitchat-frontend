<script setup>
import Header from '@/layout/Header.vue';
import AppMenu from '@/layout/AppMenu.vue';
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
    <div class="main">
        <Header />
        <div class="pt-8">
            <div class="grid grid-nogutter">
                <div class="col-3">
                    <AppMenu />
                </div>
                <router-view />
            </div>
        </div>
        <ConfirmDialog />
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
