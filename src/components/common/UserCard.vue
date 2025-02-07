<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useFriendRequestStore } from '@/stores';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    showRemove: {
        type: Boolean
    },
    myFriends: {
        type: Boolean
    },
    friendRequest: {
        type: Boolean
    },
    friendRequestId: {
        type: Number
    }
});

const router = useRouter();
const friendRequestStore = useFriendRequestStore();
const unfriendConfirm = useConfirm();
const busy = ref(false);
const user = props.user;
const friendRequestId = props.friendRequestId;
const requestSent = ref(user.friend_request_status === 'pending' || false);
const sendingRequest = ref(false);
const cancelingRequest = ref(false);
const acceptingRequest = ref(false);
const emit = defineEmits(['reloadFriends', 'requestAction']);

const unfriendConfirmation = (user) => {
    unfriendConfirm.require({
        message: `Are you sure you want to remove ${user.name} as your friend?
`,
        header: `Unfriend ${user.name}`,
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
            removeFriend(user);
        },
        reject: () => {}
    });
};
const deleteConfirmation = (user) => {
    unfriendConfirm.require({
        message: `Are you sure you want to delete ${user.name} friend request?
`,
        header: `Unfriend ${user.name}`,
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
            deleteFriend(user);
        },
        reject: () => {}
    });
};

const sendRequest = async (user) => {
    try {
        sendingRequest.value = true;
        await friendRequestStore.sendRequest({ recipient_id: user.id });
        requestSent.value = true;
    } catch (error) {
        console.error(error);
    } finally {
        sendingRequest.value = false;
    }
};

const removeFriend = async (user) => {
    try {
        busy.value = true;
        await friendRequestStore.removeFriend(user.id);
        emit('reloadFriends', user);
    } catch (error) {
        console.error(error);
    } finally {
        busy.value = false;
    }
};

const cancelRequest = async (user) => {
    try {
        cancelingRequest.value = true;
        await friendRequestStore.cancelRequest(user.id);
        requestSent.value = false;
    } catch (error) {
        console.error(error);
    } finally {
        cancelingRequest.value = false;
    }
};

const acceptRequest = async (friendRequestId) => {
    try {
        acceptingRequest.value = true;
        await friendRequestStore.acceptRequest(friendRequestId);
        emit('requestAction');
    } catch (error) {
        console.error(error);
    } finally {
        acceptingRequest.value = false;
    }
};

const deleteFriend = async (user) => {
    try {
        busy.value = true;
        await friendRequestStore.deleteFriendRequest(user.id);
        emit('requestAction');
    } catch (error) {
        console.error(error);
    } finally {
        busy.value = false;
    }
};
</script>
<template>
    <div class="user-card" v-if="user">
        <router-link
            :to="{
                name: 'user-detail',
                params: { username: user.username || 'username' }
            }"
            class="user-card__image"
        >
            <img
                class="imgFluid"
                :src="user.profile_picture"
                :alt="user.name"
            />
        </router-link>
        <div class="user-card__content">
            <router-link
                :to="{
                    name: 'user-detail',
                    params: { username: user.username || 'username' }
                }"
                class="name hover:underline"
            >
                {{ user.name }}
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
                <span
                    class="friends"
                    v-if="user.mutual_friends && user.mutual_friends.length > 0"
                    >{{ user.mutual_friends.length }} mutual friend{{
                        user.mutual_friends.length > 1 ? 's' : ''
                    }}</span
                >
            </div>
            <template v-if="!props.myFriends">
                <template v-if="!props.friendRequest">
                    <Button
                        v-if="!requestSent"
                        class="w-full"
                        label="Add friend"
                        icon="fa-solid fa-user-plus"
                        @click="sendRequest(user)"
                        :loading="sendingRequest"
                        :disabled="sendingRequest"
                    />
                    <Button
                        v-if="requestSent"
                        class="w-full"
                        label="Cancel Request"
                        icon="fa-solid fa-user-minus"
                        @click="cancelRequest(user)"
                        :loading="cancelingRequest"
                        :disabled="cancelingRequest"
                    />
                </template>
                <template v-else>
                    <Button
                        class="w-full"
                        label="Confirm"
                        @click="acceptRequest(friendRequestId)"
                        :loading="acceptingRequest"
                        :disabled="acceptingRequest"
                    />
                    <Button
                        class="w-full bg-primary-light mt-2"
                        label="Delete"
                        variant="outlined"
                        @click="deleteConfirmation(user)"
                        :loading="busy"
                        :disabled="busy"
                    />
                </template>
            </template>
            <template v-else>
                <Button
                    label="Message"
                    class="w-full"
                    icon="fa-brands fa-facebook-messenger"
                    @click="
                        router.push({
                            name: 'chats',
                            params: { username: user.username }
                        })
                    "
                />
            </template>
            <Button
                v-if="showRemove"
                class="w-full bg-primary-light mt-2"
                label="Remove"
                variant="outlined"
                icon="fa-solid fa-user-minus"
                @click="unfriendConfirmation(user)"
                :loading="busy"
                :disabled="busy"
            />
        </div>
    </div>
</template>

<style scoped>
.user-card {
    width: 200px;
    background: var(--card-bg);
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid var(--card-shadow);
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
    color: var(--text-gray-color);
}
.user-card__content .name {
    color: var(--text-color);
    font-size: 1rem;
    font-weight: 500;
}
.user-card__content .p-button {
    font-size: 0.84rem;
    border-color: var(--primary-light-color);
}
.grid .user-card:not(.swiper-slide .user-card) {
    margin-right: 0.9rem;
    margin-bottom: 0.95rem;
}
.swiper-slide .user-card {
    width: auto;
}
</style>
