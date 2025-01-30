<script setup>
import { ref } from 'vue';
const loading = ref(true);
const user = ref({});
import { useRoute } from 'vue-router';

const route = useRoute();
const username = ref(route.params.username);

setTimeout(() => {
    loading.value = false;
    user.value = {
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
    };
}, 1500);
</script>

<template>
    <div class="col-5 ml-6 pl-5"></div>
</template>
