<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
import { useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const credentials = ref({
    token: '',
    email: '',
    password: '',
    password_confirmation: ''
});
const pushRoute = (name) => {
    router.push({ name });
};

const resetPassword = async () => {
    try {
        loading.value = true;
        credentials.value = {
            ...credentials.value,
            email: route.query.email,
            token: route.query.token
        };
        await authStore.resetPassword(credentials.value);
        pushRoute('login');
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
const isSubmitEnabled = computed(() => {
    return (
        credentials.value.password &&
        credentials.value.password.length > 7 &&
        credentials.value.password_confirmation &&
        credentials.value.password_confirmation.length > 7
    );
});
</script>

<template>
    <div>
        <h4 class="text-2xl text-center mb-4">Let's reset your password</h4>

        <form @submit.prevent="resetPassword">
            <div class="p-fluid formgrid grid">
                <div class="field col-12">
                    <InputField
                        placeholder="Password"
                        id="password"
                        variant="password"
                        v-model="credentials.password"
                        toggleMask
                        :feedback="false"
                        inputClass="text-sm w-full"
                    />
                </div>
                <div class="field col-12">
                    <InputField
                        placeholder="Confirm password"
                        id="password_confirmation"
                        variant="password"
                        v-model="credentials.password_confirmation"
                        toggleMask
                        :feedback="false"
                        inputClass="text-sm w-full"
                    />
                </div>
            </div>
            <Button
                :disabled="!isSubmitEnabled || loading"
                class="w-full text-sm"
                label="Continue"
                :loading="loading"
                type="submit"
            />
        </form>
    </div>
</template>
<style>
.p-password {
    width: 100%;
}
</style>
