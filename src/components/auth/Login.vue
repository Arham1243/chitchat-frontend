<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const credentials = ref({
    email: '',
    password: '',
    remember_me: false,
    auth_challenge_type: 'email'
});

const pushRoute = (name, query = {}) => {
    router.push({ name, query });
};

const login = async () => {
    try {
        loading.value = true;
        const res = await authStore.login(credentials.value);
        if (res.data.challenge === 'NEW_PASSWORD_REQUIRED') {
            const session = res.data.session;
            pushRoute('Password Setup', { session });
        } else if (res.data.challenge === 'VERIFICATION_REQUIRED') {
            const session = res.data.session;
            pushRoute('Verify Email Code', { session });
        }
    } catch (e) {
        // Handle error
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <h4 class="font-bold text-3xl text-center mb-6">Login</h4>
        <form @submit.prevent="login">
            <div class="p-fluid formgrid grid">
                <div class="field col-12 mb-4">
                    <label class="block mb-2" for="email">Email</label>
                    <InputField
                        id="email"
                        variant="text"
                        v-model="credentials.email"
                        class="w-full"
                    />
                </div>
                <div class="field col-12">
                    <label class="block mb-2" for="password">Password</label>
                    <InputField
                        id="password"
                        variant="password"
                        v-model="credentials.password"
                        class="w-full"
                        toggleMask
                        :feedback="false"
                    />
                </div>
            </div>
            <div
                class="flex justify-content-between align-items-center pt-1 pb-5"
            >
                <div class="flex">
                    <InputField
                        inputId="remember"
                        variant="checkbox"
                        binary
                        v-model="credentials.remember_me"
                    />
                    <label for="remember" class="mt-1 ml-2 cursor-pointer"
                        >Remember me</label
                    >
                </div>
            </div>
            <Button
                class="w-full"
                label="Login"
                :loading="loading"
                type="submit"
            />
        </form>
    </div>
</template>
