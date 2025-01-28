<script setup>
// import Logo from '@/assets/images/auth-logo.png';
</script>

<template>
    <div
        class="w-screen h-screen flex justify-content-center align-items-center auth-bg"
    >
        <div class="grid w-full justify-content-center">
            <div class="auth-wrapper">
                <!-- <div class="text-center mb-3">
                    <img :src="Logo" width="230" class="logo" />
                </div> -->
                <div class="auth-box bg-white border-round-lg text-color">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-bg {
    background-color: var(--p-primary-color);
}
.auth-wrapper {
    width: 470px;
}

.auth-box {
    padding: 3.5rem 3.25rem;
}
</style>
