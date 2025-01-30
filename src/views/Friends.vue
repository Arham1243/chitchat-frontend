<script setup>
import { ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';

const loading = ref(true);
const users = ref([]);
setTimeout(() => {
    loading.value = false;
    users.value = [
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
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
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        },
        {
            full_name: 'Arham Khan',
            username: 'arhamkhan',
            profile_picture: '/src/assets/images/placeholder-user.png'
        }
    ];
}, 1500);
</script>

<template>
    <div class="col-8 col-offset-1">
        <div class="page-content">
            <div class="page-title">People you may know</div>
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
                        <UserCard :user="user" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
