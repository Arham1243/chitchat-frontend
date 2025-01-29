<script setup>
import Logo from '@/assets/images/logo.png';
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
    router.back();
}
</script>

<template>
    <div
        class="w-screen h-screen flex justify-content-center align-items-center bg-primary-light"
    >
        <div class="w-full grid p-fluid justify-content-center">
            <div class="col-fixed" style="width: 54%">
                <div class="text-center mb-3">
                    <img :src="Logo" width="190" class="logo" />
                </div>
                <div
                    class="w-full error-box border-round-lg text-color bg-white"
                >
                    <div class="p-fluid grid w-full align-items-center">
                        <div class="sm:col-12 lg:col-5 p-0">
                            <div class="circle-image pl-6">
                                <i
                                    style="font-size: 11rem"
                                    class="fa-solid fa-circle-exclamation text-primary"
                                ></i>
                            </div>
                        </div>
                        <div class="sm:col-12 lg:col-7 p-0">
                            <div class="content">
                                <div class="text-6xl font-bold line-height-1">
                                    404
                                </div>
                                <div
                                    class="text-xl font-semibold uppercase my-3"
                                >
                                    page not found
                                </div>
                                <div>
                                    Sorry! We can't find the content you're
                                    looking for.
                                </div>
                                <Button
                                    label="Go Back"
                                    class="mt-4 w-18rem"
                                    @click="goBack"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
body .error-box {
    padding: 6rem 3rem 4.75rem;
}
</style>
