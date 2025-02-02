<script setup>
import { useRoute } from 'vue-router';
import Logo from '@/assets/images/logo.png';

const route = useRoute();
</script>

<template>
    <div v-if="route.params.username === '-1'">
        <div
            class="w-full h-screen flex justify-content-center align-items-center"
        >
            <div class="grid w-full justify-content-center">
                <div class="text-center mb-4">
                    <img :src="Logo" width="145" class="logo mb-2" alt="logo" />
                    <div class="text-2xl font-semibold heading mb-1">
                        Stay Connected Effortlessly
                    </div>
                    <div class="text-sm font-medium para">
                        Send and receive messages anytime, without
                        interruptions.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.heading {
    color: var(--text-color);
}
.para {
    color: var(--text-gray-color);
}
</style>
