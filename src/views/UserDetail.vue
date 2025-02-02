<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import FriendCard from '@/components/common/FriendCard.vue';
import { useRoute } from 'vue-router';
import users from '@/mocks/users.json';

const route = useRoute();
const loading = ref(false);
const busy = ref(false);
const user = ref({});
const currentUser = {
    full_name: 'Arham Khan',
    username: 'arhamkhan'
};
const unfriendConfirm = useConfirm();
const toast = useToast();

onBeforeMount(() => {
    fetchUser();
});
watch(
    () => route.params.username,
    () => {
        fetchUser();
    }
);

const fetchUser = () => {
    loading.value = true;
    setTimeout(() => {
        user.value = users.find((u) => u.username === route.params.username);
        loading.value = false;
    }, 1500);
};

const unfriendConfirmation = () => {
    unfriendConfirm.require({
        message: `Are you sure you want to remove ${user.value.full_name} as your friend?
`,
        header: `Unfriend ${user.value.full_name}`,
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
            unfriend();
        },
        reject: () => {}
    });
};
const unfriend = () => {
    busy.value = true;
    new Promise(() => {
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: `${user.value.full_name} removed`,
                detail: `${user.value.full_name} was unfriended successfully`,
                life: 3000
            });
            busy.value = false;
            user.value.is_friend = 'no';
        }, 1500);
    });
};

const sendRequest = () => {
    busy.value = true;
    new Promise(() => {
        setTimeout(() => {
            busy.value = false;
            user.value.is_friend = 'pending';
        }, 1500);
    });
};

const cancelRequest = () => {
    busy.value = true;
    new Promise(() => {
        setTimeout(() => {
            busy.value = false;
            user.value.is_friend = 'no';
        }, 1500);
    });
};
</script>

<template>
    <div class="col-8 col-offset-1">
        <div class="page-content mb-5">
            <div class="profile">
                <div class="grid align-items-center" v-if="loading">
                    <div class="col-3">
                        <div class="profile-image">
                            <Skeleton
                                width="180px"
                                height="180px"
                                borderRadius="100px"
                            ></Skeleton>
                        </div>
                    </div>
                    <div class="col-9">
                        <div class="profile-info">
                            <Skeleton
                                width="200px"
                                height="18px"
                                borderRadius="100px"
                            ></Skeleton>
                            <Skeleton
                                width="150px"
                                height="18px"
                                borderRadius="100px"
                                class="mt-2"
                            ></Skeleton>
                            <div class="flex justify-content-between mt-3">
                                <div class="mutual flex">
                                    <Skeleton
                                        v-for="index in 4"
                                        :key="index"
                                        width="36px"
                                        height="36px"
                                        borderRadius="100px"
                                    ></Skeleton>
                                </div>
                                <div
                                    class="actions flex gap-2"
                                    v-if="
                                        currentUser.username !==
                                        route.params.username
                                    "
                                >
                                    <Skeleton
                                        width="120px"
                                        height="40px"
                                        borderRadius="6px"
                                    ></Skeleton>
                                    <Skeleton
                                        width="120px"
                                        height="40px"
                                        borderRadius="6px"
                                    ></Skeleton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="grid align-items-center">
                    <div class="col-3">
                        <div class="profile-image">
                            <Image
                                :src="user.profile_picture"
                                :alt="user.full_name"
                                class="imgFluid border-3"
                                style="border-color: #e2e8f0"
                                preview
                            />
                            <button
                                class="edit-image"
                                v-if="currentUser.username === user.username"
                            >
                                <i class="fa-solid fa-camera"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-9">
                        <div class="profile-info">
                            <div class="name">{{ user.full_name }}</div>
                            <div class="friends">
                                {{ user.friends.length }} friend{{
                                    user.friends.length > 1 ? 's' : ''
                                }}
                                <span
                                    v-if="
                                        user.mutual_friends &&
                                        user.mutual_friends.length > 0
                                    "
                                >
                                    • {{ user.mutual_friends.length }} mutual
                                </span>
                            </div>
                            <div class="flex justify-content-between mt-3">
                                <div
                                    class="mutual"
                                    v-if="
                                        user.mutual_friends &&
                                        user.mutual_friends.length > 0
                                    "
                                >
                                    <AvatarGroup>
                                        <Avatar
                                            v-for="(
                                                friend, index
                                            ) in user.mutual_friends.slice(
                                                0,
                                                8
                                            )"
                                            :key="index"
                                            :image="friend.profile_picture"
                                            shape="circle"
                                        />
                                    </AvatarGroup>
                                </div>
                                <div
                                    class="actions flex gap-2"
                                    v-if="
                                        currentUser.username !== user.username
                                    "
                                >
                                    <Button
                                        v-if="user.is_friend === 'yes'"
                                        label="Friends"
                                        icon="fa-solid fa-user-check"
                                        variant="outlined"
                                        @click="unfriendConfirmation"
                                        :loading="busy"
                                    />
                                    <Button
                                        v-else-if="user.is_friend === 'no'"
                                        class="bg-primary-light"
                                        label="Add friend"
                                        icon="fa-solid fa-user-plus"
                                        variant="outlined"
                                        @click="sendRequest"
                                        :loading="busy"
                                    />
                                    <Button
                                        v-else-if="user.is_friend === 'pending'"
                                        class="bg-primary-light"
                                        label="Cancel request"
                                        icon="fa-solid fa-user-minus"
                                        variant="outlined"
                                        @click="cancelRequest"
                                        :loading="busy"
                                    />
                                    <Button
                                        label="Message"
                                        icon="fa-brands fa-facebook-messenger"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tabs value="0" v-if="!loading">
                <TabList>
                    <Tab value="0">Friends</Tab>
                    <Tab
                        value="1"
                        v-if="
                            user.mutual_friends &&
                            user.mutual_friends.length > 0
                        "
                        >Mutual friends</Tab
                    >
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="grid mt-3">
                            <div
                                class="col-6"
                                v-for="(friend, index) in user.friends"
                                :key="index"
                            >
                                <FriendCard :friend="friend" :user="user" />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel
                        value="1"
                        v-if="
                            user.mutual_friends &&
                            user.mutual_friends.length > 0
                        "
                    >
                        <div class="grid mt-3">
                            <div
                                class="col-6"
                                v-for="(friend, index) in user.mutual_friends"
                                :key="index"
                            >
                                <FriendCard :friend="friend" :user="user" />
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>
</template>
<style>
.profile {
    background: var(--box-bg);
    border-radius: 0.75rem;
    padding: 1.5rem 2.5rem;
    --p-avatar-width: 2.25rem;
    --p-avatar-height: 2.25rem;
    --p-tabs-tab-border-width: 0 0 3px 0;
}
.profile-image {
    position: relative;
    display: flex;
    justify-content: center;
}
.profile-image .p-image {
    width: 180px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    overflow: hidden;
}
.profile-info .name {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}
.profile-info .friends {
    color: var(--text-gray-color);
    font-size: 0.85rem;
    font-weight: 500;
}
.edit-image {
    outline: none;
    width: 33px;
    aspect-ratio: 1/1;
    background: var(--card-bg);
    border-radius: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0.45rem;
    bottom: 1.35rem;
    font-size: 1.05rem;
    border: 2px solid #d1d5dba8;
    z-index: 10;
}

.edit-image:hover {
    filter: brightness(0.95);
}
</style>
