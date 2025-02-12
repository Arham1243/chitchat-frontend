<script setup>
import { onBeforeMount, ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import MyRequests from '@/components/MyRequests.vue';
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
        const res = await userStore.getFriends();
        users.value = res;
    } catch (error) {
        console.error(error);
    }
};
const reloadFriends = async () => {
    loading.value = true;
    await Promise.all([getUsers()]);
    loading.value = false;
};
</script>

<template>
    <div class="col-12 lg:col-8 lg:col-offset-1">
        <MyRequests @reloadFriends="reloadFriends" />
        <div class="page-content">
            <div class="page-title">My Friends</div>
            <div class="friends">
                <template v-if="loading">
                    <div class="grid grid-nogutter pr-2">
                        <div
                            class="p-col-12 p-md-6 p-lg-3 pb-0 mb-hidden"
                            v-for="index in 8"
                            :key="index"
                        >
                            <Skeleton
                                class="mb-2 mr-2"
                                height="322px"
                                width="205px"
                            ></Skeleton>
                        </div>
                        <div
                            class="col-12 p-md-6 p-lg-3 mb-show"
                            v-for="index in 2"
                            :key="index"
                        >
                            <div class="friend-card w-full">
                                <div class="friend-card__image border-circle">
                                    <Skeleton
                                        shape="circle"
                                        size="70px"
                                    ></Skeleton>
                                </div>
                                <div class="friend-card__content">
                                    <Skeleton
                                        width="3rem"
                                        height="8px"
                                        borderRadius="100px"
                                        class="mt-1"
                                    ></Skeleton>
                                    <div class="mutual-friends mt-2">
                                        <div class="flex">
                                            <Skeleton
                                                v-for="index in 2"
                                                :key="index"
                                                width="36px"
                                                height="36px"
                                                borderRadius="100px"
                                            ></Skeleton>
                                        </div>
                                        <Skeleton
                                            width="3rem"
                                            height="8px"
                                            borderRadius="100px"
                                            class="mt-1"
                                        ></Skeleton>
                                    </div>
                                    <div class="card-btns">
                                        <Skeleton
                                            width="80px"
                                            height="32px"
                                            borderRadius="6px"
                                        ></Skeleton>
                                        <Skeleton
                                            width="80px"
                                            height="32px"
                                            borderRadius="6px"
                                        ></Skeleton>
                                    </div>
                                </div>
                            </div>
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
                                    list-view
                                    :user="user"
                                    show-remove
                                    my-friends
                                    @reloadFriends="reloadFriends"
                                />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-sm text-black-alpha-60">
                            No friends found.
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
