<script setup>
import { onBeforeMount, ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import usersMock from '@/mocks/users.json';

const loading = ref(false);
const users = ref([]);
const handleUserUnfriended = () => {
    getItems();
};
onBeforeMount(() => {
    getItems();
});

const getItems = () => {
    loading.value = true;
    new Promise((resolve) => {
        setTimeout(() => {
            loading.value = false;
            users.value = usersMock;
            resolve();
        }, 1500);
    });
};
</script>

<template>
    <div class="col-8 col-offset-1">
        <div class="page-content">
            <div class="page-title">My Friends</div>
            <div class="friends">
                <div class="grid grid-nogutter pr-2" v-if="loading">
                    <div
                        class="p-col-12 p-md-6 p-lg-3 pb-0"
                        v-for="index in 8"
                        :key="index"
                    >
                        <Skeleton
                            class="mb-2 mr-2"
                            height="322px"
                            width="205px"
                        ></Skeleton>
                    </div>
                </div>
                <div v-else class="grid grid-nogutter">
                    <div
                        class="p-col-12 p-md-6 p-lg-3"
                        v-for="(user, index) in users"
                        :key="index"
                    >
                        <UserCard
                            :user="user"
                            show-remove
                            @userUnfriended="handleUserUnfriended"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
