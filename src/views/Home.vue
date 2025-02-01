<script setup>
import { onBeforeMount, ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import usersMock from '@/mocks/users.json';

const swiperModules = [Navigation];
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

<template>
    <div class="col-4 col-offset-1">
        <div class="box pr-0">
            <div class="box-header">
                <div class="title">People you may know</div>
            </div>
            <div class="box-body">
                <div class="grid grid-nogutter" v-if="loading">
                    <Skeleton
                        v-for="index in 2"
                        :key="index"
                        style="margin-right: 0.6rem"
                        height="310px"
                        width="181px"
                    ></Skeleton>
                    <Skeleton height="310px" width="61px"></Skeleton>
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
