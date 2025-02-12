<script setup>
const props = defineProps({
    friend: {
        type: Object,
        required: true
    }
});

const friend = props.friend;
</script>
<template>
    <div class="friend-card">
        <router-link
            :to="{
                name: 'user-detail',
                params: { username: friend.username }
            }"
            class="friend-card__image"
        >
            <img
                class="imgFluid"
                :src="friend.profile_picture"
                :alt="friend.name"
            />
        </router-link>
        <div class="friend-card__content">
            <router-link
                :to="{
                    name: 'user-detail',
                    params: { username: friend.username }
                }"
                class="name hover:underline"
            >
                {{ friend.name }}
            </router-link>
            <div
                class="friend"
                v-if="friend.mutual_friends && friend.mutual_friends.length > 0"
            >
                {{ friend.mutual_friends.length }} mutual friend{{
                    friend.mutual_friends.length > 1 ? 's' : ''
                }}
            </div>
        </div>
    </div>
</template>
