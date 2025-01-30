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
    <div class="col-9 pl-3">
        <div class="page-content">
            <div class="page-title">My Friends</div>
            <div class="friends">
                <div class="grid grid-nogutter" v-if="loading">
                    <div class="col-3" v-for="index in 8" :key="index">
                        <Skeleton
                            class="mb-3"
                            height="322px"
                            width="215px"
                        ></Skeleton>
                    </div>
                </div>
                <div v-else class="grid grid-nogutter">
                    <div
                        class="col-3"
                        v-for="(user, index) in users"
                        :key="index"
                    >
                        <UserCard :user="user" show-remove />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
