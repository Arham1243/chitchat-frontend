<script setup>
import { ref } from 'vue';
import UserCard from '@/components/common/UserCard.vue';

const users = ref([
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
]);
</script>

<template>
    <div class="col-9 pl-3">
        <div class="page-content">
            <div class="page-title">My Friends</div>
            <div class="friends">
                <div class="grid grid-nogutter">
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
