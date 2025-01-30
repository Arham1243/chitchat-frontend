<script setup>
import Header from '@/layout/Header.vue';
import AppMenu from '@/layout/AppMenu.vue';
</script>
<template>
    <div class="main">
        <Header />
        <div class="pt-8">
            <div class="grid grid-nogutter">
                <div class="col-3">
                    <AppMenu />
                </div>
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
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
    background: #f2f4f7;
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
