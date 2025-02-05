<script setup>
import { onBeforeMount, ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import { useUserStore } from '@/stores';

const emit = defineEmits(['reloadFriends']);

const userStore = useUserStore();
const requests = ref([]);

onBeforeMount(async () => {
    await getMyRequests();
});

const getMyRequests = async () => {
    try {
        const res = await userStore.getMyRequests();
        requests.value = res;
    } catch (error) {
        console.log(error);
    }
};
const handleRequestAction = async () => {
    await getMyRequests();
    emit('reloadFriends');
};
</script>

<template>
    <template v-if="requests.length > 0">
        <div class="page-content">
            <div class="page-title">Friend Requests</div>
            <div class="friends">
                <div class="grid grid-nogutter">
                    <div
                        class="p-col-12 p-md-6 p-lg-3"
                        v-for="(user, index) in requests"
                        :key="index"
                    >
                        <UserCard
                            :user="user.sender"
                            friend-request
                            :friend-request-id="user.id"
                            @requestAction="handleRequestAction"
                        />
                    </div>
                </div>
            </div>
        </div>
        <Divider class="mb-5" />
    </template>
</template>
