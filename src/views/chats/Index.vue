<script setup>
import { onBeforeMount, ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import usersMock from '@/mocks/users.json';

const loading = ref(true);
const users = ref([]);

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

<template>chats</template>
