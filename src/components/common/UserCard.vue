<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const unfriendConfirm = useConfirm();
const toast = useToast();
const busy = ref(false);

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
const emit = defineEmits(['userUnfriended']);

const unfriendConfirmation = (user) => {
    unfriendConfirm.require({
        message: `Are you sure you want to remove ${user.full_name} as your friend?
`,
        header: `Unfriend ${user.full_name}`,
        icon: 'fa-regular fa-circle-xmark',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            variant: 'text'
        },
        acceptProps: {
            label: 'Confirm',
            severity: 'danger'
        },
        accept: () => {
            unfriend(user);
        },
        reject: () => {}
    });
};

const unfriend = (user) => {
    busy.value = true;
    new Promise(() => {
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: `${user.full_name} removed`,
                detail: `${user.full_name} was unfriended successfully`,
                life: 3000
            });
            busy.value = false;
            emit('userUnfriended', user);
        }, 1500);
    });
};
</script>
<template>
    <div class="user-card">
        <router-link
            :to="{
                name: 'user-detail',
                params: { username: user.username }
            }"
            class="user-card__image"
        >
            <img
                class="imgFluid"
                :src="user.profile_picture"
                :alt="user.full_name"
            />
        </router-link>
        <div class="user-card__content">
            <router-link
                :to="{
                    name: 'user-detail',
                    params: { username: user.username }
                }"
                class="name hover:underline"
            >
                {{ user.full_name }}
            </router-link>
            <div class="mutual">
                <AvatarGroup
                    v-if="user.mutual_friends && user.mutual_friends.length > 0"
                >
                    <Avatar
                        v-for="(friend, index) in user.mutual_friends.slice(
                            0,
                            2
                        )"
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
                @click="unfriendConfirmation(user)"
                :loading="busy"
            />
        </div>
    </div>
</template>

<style scoped>
.user-card {
    width: 200px;
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
    color: #000;
    font-size: 1rem;
    font-weight: 500;
}
.user-card__content .p-button {
    font-size: 0.9rem;
}
.grid .user-card:not(.swiper-slide .user-card) {
    margin-right: 0.9rem;
    margin-bottom: 0.95rem;
}
.swiper-slide .user-card {
    width: auto;
}
</style>
