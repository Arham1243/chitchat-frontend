<script setup>
import { onBeforeMount, ref } from 'vue';
import { useUserStore } from '@/stores';
import UserCard from '@/components/common/UserCard.vue';

import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { onMounted } from 'vue';
import { echo } from '@/plugins/echo';

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
        console.error(error);
    }
};

const getOnlineUsers = async () => {
    try {
        const res = await userStore.getOnlineFriends();
        onlineUsers.value = res;
    } catch (error) {
        console.error(error);
    }
};
onMounted(async () => {
    echo.channel('users')
        .listen('.user.logged.in', async () => {
            await getOnlineUsers();
        })
        .listen('.user.logged.out', async () => {
            await getOnlineUsers();
        });
});
</script>

<template>
    <div class="col-12 lg:col-4 lg:col-offset-1">
        <div class="box pr-0">
            <div class="box-header">
                <div class="title">People you may know</div>
            </div>
            <div class="box-body">
                <template v-if="loading">
                    <Swiper
                        :slides-per-view="2.39"
                        :space-between="12"
                        :pagination="{ clickable: true }"
                        :navigation="true"
                        :modules="swiperModules"
                        :breakpoints="{
                            320: {
                                slidesPerView: 1.5,
                                spaceBetween: 8
                            },
                            640: {
                                slidesPerView: 1.8,
                                spaceBetween: 10
                            },
                            1024: {
                                slidesPerView: 2.39,
                                spaceBetween: 12
                            }
                        }"
                    >
                        <SwiperSlide v-for="index in 3" :key="index">
                            <Skeleton height="310px"></Skeleton>
                        </SwiperSlide>
                    </Swiper>
                </template>
                <template v-else>
                    <Swiper
                        :slides-per-view="2.39"
                        :space-between="12"
                        :pagination="{ clickable: true }"
                        :navigation="true"
                        :modules="swiperModules"
                        :breakpoints="{
                            320: {
                                slidesPerView: 1.5,
                                spaceBetween: 8
                            },
                            640: {
                                slidesPerView: 1.8,
                                spaceBetween: 10
                            },
                            1024: {
                                slidesPerView: 2.39,
                                spaceBetween: 12
                            }
                        }"
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
    <div class="col-3 col-offset-1 mb-hidden">
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
                            name: 'chats',
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
                                :class="user.is_online ? 'green' : 'red'"
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
