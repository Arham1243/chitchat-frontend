<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const credentials = ref({
    email: ''
});

const pushRoute = (name, query = {}) => {
    router.push({ name, query });
};

const forgetPassword = async () => {
    try {
        loading.value = true;
        await authStore.forgetPassword(credentials.value);
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const isSubmitEnabled = computed(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return credentials.value.email && emailRegex.test(credentials.value.email);
});
</script>

<template>
    <div>
        <h4 class="font-medium text-2xl text-center mb-2">Forgot Password</h4>
        <p class="text-xs text-center mb-4 text-100">
            Enter the email address where you'd like us to send your password
            reset link.
        </p>

        <form @submit.prevent="forgetPassword">
            <div class="p-fluid formgrid grid">
                <div class="field col-12 mb-3 pb-1">
                    <InputField
                        id="email"
                        placeholder="Email address"
                        variant="text"
                        v-model="credentials.email"
                        class="w-full text-sm"
                    />
                </div>
            </div>
            <Button
                :disabled="!isSubmitEnabled"
                class="w-full text-sm"
                label="Continue"
                :loading="loading"
                type="submit"
            />
        </form>
    </div>
</template>
