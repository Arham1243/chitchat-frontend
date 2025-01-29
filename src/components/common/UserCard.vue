<script setup>
const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    showRemove: {
        type: Boolean
    }
});
const user = props.user;
</script>
<template>
    <div class="user-card">
        <div class="user-card__image">
            <img
                class="imgFluid"
                :src="user.profile_picture"
                :alt="user.full_name"
            />
        </div>
        <div class="user-card__content">
            <div class="name">
                {{ user.full_name }}
            </div>
            <div class="mutual">
                <AvatarGroup v-if="user.mutual_friends">
                    <Avatar
                        v-for="(friend, index) in user.mutual_friends"
                        :key="index"
                        :image="friend.profile_picture"
                        shape="circle"
                    />
                </AvatarGroup>
                <span class="friends" v-if="user.mutual_friends"
                    >{{ user.mutual_friends.length }} mutual friend{{
                        user.mutual_friends.length > 1 ? 's' : ''
                    }}</span
                >
            </div>
            <Button
                class="w-full bg-primary-light"
                label="Add friend"
                icon="fa-solid fa-user-plus"
                variant="outlined"
            />
            <Button
                v-if="showRemove"
                class="w-full mt-2"
                label="Remove"
                severity="secondary"
                icon="fa-solid fa-user-minus"
            />
        </div>
    </div>
</template>

<style scoped>
.user-card {
    background: #fff;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0 1px 1px #00000020;
}
.user-card__image {
    width: 100%;
    height: 200px;
}
.user-card__image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.user-card__content {
    padding: 0.75rem;
}
.user-card__content .mutual {
    --p-avatar-width: 1.45rem;
    --p-avatar-height: 1.45rem;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.2rem;
}
.user-card__content .friends {
    font-size: 0.85rem;
    font-weight: 500;
    color: #8d9093;
}
.user-card__content .name {
    font-size: 1rem;
    font-weight: 500;
}
.user-card__content .p-button {
    font-size: 0.9rem;
}
.grid .user-card {
    margin-right: 0.9rem;
    margin-bottom: 0.95rem;
}
</style>
