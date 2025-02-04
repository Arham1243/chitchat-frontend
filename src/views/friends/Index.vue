<script setup>
import { onBeforeMount, ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const loading = ref(true);
const users = ref([]);

onBeforeMount(async () => {
    await Promise.all([getUsers()]);
    loading.value = false;
});

const getUsers = async () => {
    try {
        const res = await userStore.getUsers();
        users.value = res;
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div class="col-8 col-offset-1">
        <div class="page-content">
            <div class="page-title">People you may know</div>
            <div class="friends">
                <template v-if="loading">
                    <div class="grid grid-nogutter pr-2">
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
                </template>
                <template v-else>
                    <template v-if="users.length > 0">
                        <div class="grid grid-nogutter">
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
                    </template>
                    <template v-else>
                        <div class="text-sm text-black-alpha-60">
                            No users found.
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
