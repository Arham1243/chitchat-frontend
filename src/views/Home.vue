<script setup>
import { ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
const swiperModules = [Navigation];
const loading = ref(true);
const users = ref([]);
setTimeout(() => {
    loading.value = false;
    users.value = [
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png',
            mutual_friends: [
                {
                    full_name: 'John Doe',
                    profile_picture: '/src/assets/images/placeholder-user.png'
                },
                {
                    full_name: 'Jane Doe',
                    profile_picture: '/src/assets/images/placeholder-user.png'
                }
            ]
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        }
    ];
}, 1500);
</script>

<template>
    <div class="col-5 ml-6 pl-5">
        <div class="box pr-0">
            <div class="box-header">
                <div class="title">People you may know</div>
            </div>
            <div class="box-body">
                <div v-if="loading" class="grid grid-nogutter">
                    <Skeleton
                        v-for="index in 2"
                        :key="index"
                        style="margin-right: 0.75rem"
                        height="320px"
                        width="200px"
                    ></Skeleton>
                    <Skeleton height="320px" width="100px"></Skeleton>
                </div>
                <Swiper
                    v-else
                    :slides-per-view="2.39"
                    :space-between="12"
                    :pagination="{ clickable: true }"
                    :navigation="true"
                    :modules="swiperModules"
                >
                    <SwiperSlide v-for="(user, index) in users" :key="index">
                        <UserCard :user="user" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
</template>
