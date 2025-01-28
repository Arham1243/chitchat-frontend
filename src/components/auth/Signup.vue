<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);

const genders = ref([
    { name: 'Male', id: 'male' },
    { name: 'Female', id: 'female' },
    { name: 'Other', id: 'other' }
]);

const credentials = ref({
    full_name: '',
    dob: '',
    gender: genders.value[0],
    email: '',
    password: ''
});
const pushRoute = (name, query = {}) => {
    router.push({ name, query });
};

const signup = async () => {
    try {
        loading.value = true;
        const res = await authStore.signup(credentials.value);
        const session = res.data.session;
        pushRoute('Home', { session });
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
const isSubmitEnabled = computed(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (
        credentials.value.full_name &&
        credentials.value.email &&
        emailRegex.test(credentials.value.email) &&
        credentials.value.gender &&
        credentials.value.password &&
        credentials.value.password.length > 7 &&
        credentials.value.dob
    );
});
</script>

<template>
    <div>
        <h4 class="font-medium text-2xl text-center mb-2">
            Create a new account
        </h4>
        <p class="text-xs text-center mb-4 text-100">Its quick and easy.</p>

        <form @submit.prevent="signup">
            <div class="p-fluid formgrid grid">
                <div class="field col-12 mb-3 pb-1">
                    <InputField
                        id="full_name"
                        placeholder="Full name"
                        variant="text"
                        v-model="credentials.full_name"
                        class="w-full text-sm"
                    />
                </div>
                <div class="field col-12 mb-3 pb-1">
                    <InputField
                        id="dob"
                        placeholder="Date of birth"
                        variant="date"
                        v-model="credentials.dob"
                        class="w-full text-sm"
                    />
                </div>
                <div class="field col-12 mb-3 pb-1">
                    <InputField
                        id="gender"
                        variant="selectButton"
                        v-model="credentials.gender"
                        placeholder="Gender"
                        class="w-full"
                        optionLabel="name"
                        :options="genders"
                    />
                </div>
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
            <div
                class="text-sm font-normal flex justify-content-center gap-1 align-items-center pb-4"
            >
                Already have and account
                <router-link
                    class="text-primary font-medium"
                    :to="{ name: 'login' }"
                >
                    Log in</router-link
                >
            </div>
            <Button
                :disabled="!isSubmitEnabled"
                class="w-full text-sm"
                label="Sign up"
                :loading="loading"
                type="submit"
            />
        </form>

        <Divider align="center" type="solid"
            ><span class="text-xs text-100"> OR</span>
        </Divider>
        <Button
            icon="pi pi-google"
            class="w-full mt-1 text-sm border-black-alpha-20 text-black-alpha-70"
            variant="outlined"
            label="Continue with Google"
            type="submit"
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
.p-datepicker-input {
    color: var(--p-inputtext-color);
    font-size: 0.875rem !important;
}
.p-togglebutton {
    width: 100%;
    font-size: 0.875rem !important;
}
</style>
