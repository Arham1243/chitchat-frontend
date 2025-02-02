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
                :alt="friend.full_name"
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
                {{ friend.full_name }}
            </router-link>
            <div class="friend" v-if="friend.is_friend">Friend</div>
        </div>
    </div>
</template>

<style scoped>
.friend-card {
    background: var(--box-bg);
    border-radius: 0.65rem;
    overflow: hidden;
    box-shadow: 0 0 1px 1px var(--card-shadow);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem;
}
.friend-card__image {
    width: 85px;
    aspect-ratio: 1/1;
    border-radius: 0.65rem;
    overflow: hidden;
}
.friend-card__image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.friend-card__content .name {
    color: var(--text-color);
    font-size: 1.05rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
}
.friend-card__content .friend {
    color: var(--text-gray-color);
    font-size: 0.85rem;
    font-weight: 500;
}
</style>
