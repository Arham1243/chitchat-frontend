<script setup>
import { useSkeletonStore } from '@/stores';
import { onBeforeMount, ref } from 'vue';
const skeletonStore = useSkeletonStore();

const users = ref([]);
const loading = ref(false);

const getItems = async () => {
    try {
        loading.value = true;
        const res = await skeletonStore.logFunction();
        users.value = res.data;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
onBeforeMount(() => {
    getItems();
});
</script>
<template>
    <div v-if="loading">loading...</div>
    <ul v-else>
        <li v-for="(user, index) in users" :key="index">
            <div>{{ user.name }}</div>
        </li>
    </ul>
</template>
