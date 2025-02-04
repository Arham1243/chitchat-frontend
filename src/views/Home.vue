<script setup>
import { onBeforeMount, ref } from 'vue';
import { useUserStore } from '@/stores';
import UserCard from '@/components/common/UserCard.vue';

import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';

const userStore = useUserStore();
const swiperModules = [Navigation];
const loading = ref(true);
const users = ref([]);
const onlineUsers = ref([]);

onBeforeMount(async () => {
    await Promise.all([getUsers(), getOnlineUsers()]);
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

const getOnlineUsers = async () => {
    try {
        const res = await userStore.getOnlineUsers();
        onlineUsers.value = res;
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div class="col-4 col-offset-1">
        <div class="box pr-0">
            <div class="box-header">
                <div class="title">People you may know</div>
            </div>
            <div class="box-body">
                <template v-if="loading">
                    <div class="grid grid-nogutter">
                        <Skeleton
                            v-for="index in 2"
                            :key="index"
                            style="margin-right: 0.6rem"
                            height="310px"
                            width="181px"
                        ></Skeleton>
                        <Skeleton height="310px" width="61px"></Skeleton>
                    </div>
                </template>
                <template v-else>
                    <Swiper
                        :slides-per-view="2.39"
                        :space-between="12"
                        :pagination="{ clickable: true }"
                        :navigation="true"
                        :modules="swiperModules"
                        v-if="users.length > 0"
                    >
                        <SwiperSlide
                            v-for="(user, index) in users"
                            :key="index"
                        >
                            <UserCard :user="user" />
                        </SwiperSlide>
                    </Swiper>
                    <template v-else>
                        <div class="text-sm text-black-alpha-60">
                            No users found.
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
    <div class="col-3 col-offset-1">
        <div class="contact">
            <div class="contact-header">
                <div class="title">Online friends</div>
            </div>
            <div class="contact-list" v-if="loading">
                <div
                    class="contact-item"
                    v-for="index in 4"
                    :key="'skeleton-' + index"
                >
                    <div class="avatar">
                        <Skeleton shape="circle" size="30px"></Skeleton>
                    </div>
                    <div class="info">
                        <Skeleton
                            width="7rem"
                            height="10px"
                            borderRadius="100px"
                        ></Skeleton>
                    </div>
                </div>
            </div>
            <template v-else>
                <div class="contact-list" v-if="onlineUsers.length > 0">
                    <router-link
                        :to="{
                            name: 'user-detail',
                            params: { username: user.username }
                        }"
                        class="contact-item"
                        v-for="(user, index) in onlineUsers"
                        :key="index"
                        v-ripple
                    >
                        <div class="avatar">
                            <img
                                :src="user.profile_picture"
                                :alt="user.name"
                                width="30"
                                height="30"
                                class="border-circle"
                            />
                            <div
                                class="status"
                                :class="index % 2 === 0 ? 'red' : 'green'"
                            ></div>
                        </div>
                        <div class="info">
                            <div class="name">{{ user.name }}</div>
                        </div>
                    </router-link>
                </div>
                <div class="text-sm text-black-alpha-60" v-else>
                    No friends online.
                </div>
            </template>
        </div>
    </div>
</template>
<style>
.contact-header {
    margin-bottom: 1.25rem;
}
.contact-header .title {
    font-size: 0.99rem;
    color: var(--text-color);
    font-weight: 600;
}
.contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    border-radius: 0.75rem;
}
.contact-item .avatar {
    position: relative;
}
.contact-item .avatar .status {
    width: 9px;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    border: 1px solid #fff;
    position: absolute;
    bottom: 4px;
    right: 2px;
    z-index: 10;
}
.contact-item .avatar .status.green {
    background: #007e32;
}
.contact-item .avatar .status.red {
    background: #f50019;
}
.contact-item:hover {
    background: var(--menu-hover-bg) !important;
}
.contact-item .name {
    color: var(--text-color);
    font-size: 0.95rem;
    font-weight: 500;
}
</style>
