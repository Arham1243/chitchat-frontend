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
                <Transition name="fade" mode="out-in">
                    <router-view></router-view>
                </Transition>
            </div>
        </div>
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
    transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
