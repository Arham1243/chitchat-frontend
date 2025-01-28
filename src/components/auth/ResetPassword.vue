<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const credentials = ref({
    password: '',
    confirm_password: ''
});

const pushRoute = (name, query = {}) => {
    router.push({ name, query });
};

const resetPassword = async () => {
    try {
        loading.value = true;
        await authStore.resetPassword(credentials.value);
        pushRoute('Login');
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
const isSubmitEnabled = computed(() => {
    return (
        credentials.value.password &&
        credentials.value.password.length > 7 &&
        credentials.value.confirm_password &&
        credentials.value.confirm_password.length > 7
    );
});
</script>

<template>
    <div>
        <h4 class="font-medium text-2xl text-center mb-4">
            Let's reset your password
        </h4>

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
                        id="confirm_password"
                        variant="password"
                        v-model="credentials.confirm_password"
                        toggleMask
                        :feedback="false"
                        inputClass="text-sm w-full"
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
<style>
.p-password {
    width: 100%;
}
</style>
