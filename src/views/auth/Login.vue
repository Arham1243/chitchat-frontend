<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
import { useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const socialLoading = ref(false);
const loading = ref(false);
const credentials = ref({
    email: '',
    password: '',
    remember_me: true
});

onBeforeMount(() => {
    if (route.query.access_token) {
        const data = {
            access_token: route.query.access_token,
            expires_in: route.query.expires_in
        };
        authStore.loginUser(data);
        pushRoute('home');
    }
});

const pushRoute = (name) => {
    router.push({ name });
};

const login = async () => {
    try {
        loading.value = true;
        await authStore.login(credentials.value);
        pushRoute('home');
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const loginWithGoogle = async () => {
    try {
        socialLoading.value = true;
        const res = await authStore.loginWithGoogle();
        window.location.href = res.redirect_url;
    } catch (error) {
        console.error(error);
    } finally {
        socialLoading.value = false;
    }
};

const isSubmitEnabled = computed(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (
        credentials.value.email &&
        emailRegex.test(credentials.value.email) &&
        credentials.value.password &&
        credentials.value.password.length > 7
    );
});
</script>

<template>
    <div>
        <h4 class="text-2xl text-center mb-4">Log in</h4>
        <form @submit.prevent="login">
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
            </div>
            <div class="flex justify-content-between align-items-center pb-4">
                <router-link
                    class="text-sm text-primary font-medium"
                    :to="{ name: 'forget-password' }"
                >
                    Forgot password?
                </router-link>

                <router-link
                    class="text-sm text-primary font-medium"
                    :to="{ name: 'signup' }"
                    >Sign up</router-link
                >
            </div>
            <Button
                :disabled="!isSubmitEnabled || loading"
                class="w-full text-sm"
                label="Log in"
                :loading="loading"
                type="submit"
            />
        </form>

        <Divider align="center" type="solid"
            ><span class="text-xs text-100"> OR</span>
        </Divider>
        <Button
            :disabled="socialLoading"
            :loading="socialLoading"
            @click="loginWithGoogle"
            icon="pi pi-google"
            class="w-full mt-1 text-sm border-black-alpha-20 text-black-alpha-70"
            variant="outlined"
            label="Continue with Google"
        />
    </div>
</template>
<style>
.p-button-outlined .pi {
    color: var(--primary-color);
}
.p-password {
    width: 100%;
}
</style>
