<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import FriendCard from '@/components/common/FriendCard.vue';
import { useFriendRequestStore } from '@/stores';
import { useRoute } from 'vue-router';
import { useUserStore, useAuthStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const friendRequestStore = useFriendRequestStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const route = useRoute();
const loading = ref(false);
const showProfilePictureDialog = ref(false);
const busy = ref(false);
const cancelingRequest = ref(false);
const sendingRequest = ref(false);
const updatingProfilePicture = ref(false);
const user = ref({});
const currentUser = computed(() => authStore.currentUser);
const unfriendConfirm = useConfirm();
const requestSent = ref(false);
const isFriend = ref(false);

onBeforeMount(() => {
    fetchUser();
});
watch(
    () => route.params.username,
    (newUsername) => {
        if (newUsername) {
            fetchUser();
        }
    }
);
const fetchUser = async () => {
    try {
        loading.value = true;
        const res = await userStore.getUser(route.params.username);
        user.value = res;
        requestSent.value =
            user.value.friend_request_status === 'pending' || false;
        isFriend.value =
            user.value.friend_request_status === 'accepted' || false;
    } catch (error) {
        if (error.status === 500) {
            router.go(-1);
        } else {
            console.error(error);
        }
    } finally {
        loading.value = false;
    }
};

const unfriendConfirmation = (friend) => {
    unfriendConfirm.require({
        message: `Are you sure you want to remove ${user.value.name} as your friend?
`,
        header: `Unfriend ${user.value.name}`,
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
            removeFriend(friend);
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
        isFriend.value = false;
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
const profile_picture = ref(null);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        profile_picture.value = e.target.result;
    };

    reader.readAsDataURL(file);
}
const openProfileDialog = () => {
    showProfilePictureDialog.value = true;
};
const closeProfileDialog = () => {
    showProfilePictureDialog.value = false;
    profile_picture.value = null;
};
const removeProfile = () => {
    profile_picture.value = null;
};

const updateProfilePicture = async () => {
    try {
        updatingProfilePicture.value = true;
        await userStore.updateProfilePicture({
            profile_picture: profile_picture.value
        });
        closeProfileDialog();
        profile_picture.value = null;
        fetchUser();
    } catch (error) {
        console.error(error);
    } finally {
        updatingProfilePicture.value = false;
    }
};
</script>

<template>
    <div class="col-12 lg:col-8 lg:col-offset-1">
        <div class="page-content mb-5">
            <div class="profile">
                <div class="grid align-items-center mb-block" v-if="loading">
                    <div class="col-9 lg:col-3">
                        <div class="profile-image">
                            <Skeleton
                                width="170px"
                                height="170px"
                                borderRadius="100px"
                            ></Skeleton>
                        </div>
                    </div>
                    <div class="col-12 lg:col-9">
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
                <div v-else class="grid align-items-center mb-block">
                    <div class="col-9 lg:col-3">
                        <div class="profile-image">
                            <Image
                                :src="user.profile_picture"
                                :alt="user.name"
                                class="imgFluid border-3"
                                style="border-color: #e2e8f0"
                                preview
                            />
                            <button
                                class="edit-image"
                                @click="openProfileDialog"
                                v-if="currentUser.username === user.username"
                            >
                                <i class="fa-solid fa-camera"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-12 lg:col-9">
                        <div class="profile-info">
                            <div class="name">{{ user.name }}</div>
                            <div class="friends">
                                <template
                                    v-if="
                                        user.friends && user.friends.length > 0
                                    "
                                >
                                    {{ user.friends.length }} friend{{
                                        user.friends.length > 1 ? 's' : ''
                                    }}
                                    <span
                                        v-if="
                                            user.mutual_friends &&
                                            user.mutual_friends.length > 0
                                        "
                                    >
                                        •
                                        {{ user.mutual_friends.length }} mutual
                                    </span>
                                </template>
                            </div>
                            <div class="flex justify-content-between mt-3">
                                <div class="mutual">
                                    <template
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
                                    </template>
                                </div>

                                <div class="actions flex gap-2">
                                    <template
                                        v-if="
                                            currentUser.username !==
                                            user.username
                                        "
                                    >
                                        <template v-if="!isFriend">
                                            <Button
                                                v-if="!requestSent"
                                                label="Add friend"
                                                icon="fa-solid fa-user-plus"
                                                @click="sendRequest(user)"
                                                :loading="sendingRequest"
                                                :disabled="sendingRequest"
                                            />
                                            <Button
                                                v-if="requestSent"
                                                label="Cancel Request"
                                                icon="fa-solid fa-user-minus"
                                                @click="cancelRequest(user)"
                                                :loading="cancelingRequest"
                                                :disabled="cancelingRequest"
                                            />
                                        </template>
                                        <template v-else>
                                            <Button
                                                label="Friends"
                                                icon="fa-solid fa-user-minus"
                                                @click="
                                                    unfriendConfirmation(user)
                                                "
                                                :loading="busy"
                                                :disabled="busy"
                                            />
                                            <Button
                                                @click="
                                                    router.push({
                                                        name: 'chats',
                                                        params: {
                                                            username:
                                                                user.username
                                                        }
                                                    })
                                                "
                                                class="bg-primary-light"
                                                variant="outlined"
                                                label="Message"
                                                icon="fa-brands fa-facebook-messenger"
                                            />
                                        </template>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tabs
                value="0"
                v-if="
                    !loading &&
                    (user.mutual_friends.length > 0 || user.friends.length > 0)
                "
            >
                <TabList>
                    <Tab
                        value="0"
                        v-if="user.friends && user.friends.length > 0"
                        >Friends</Tab
                    >
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
                                class="col-12 lg:col-6"
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
                                class="col-12 lg:col-6"
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

    <Dialog
        v-model:visible="showProfilePictureDialog"
        modal
        header="Choose profile picture"
        :style="{ width: '35rem' }"
        class="dialog-bg"
    >
        <div
            class="flex justify-content-center relative mx-auto"
            style="width: 250px"
            v-if="profile_picture"
        >
            <button type="button" class="remove-profile" @click="removeProfile">
                <i class="pi pi-times"></i>
            </button>
            <Image
                :src="profile_picture"
                alt="Profile"
                width="250px"
                height="250px"
                class="imgFluid dialog-bg mb-4"
                style="border-color: #e2e8f0"
                preview
            />
        </div>
        <FileUpload
            v-if="!profile_picture"
            mode="basic"
            @select="onFileSelect"
            customUpload
            auto
            accept="image/*"
            severity="secondary"
            class="p-button-outlined w-full"
        />

        <div class="flex justify-content-end gap-2 mt-4" v-if="profile_picture">
            <Button
                type="button"
                label="Cancel"
                class="p-button-outlined"
                @click="closeProfileDialog"
            ></Button>
            <Button
                icon="pi pi-check"
                type="button"
                label="Save"
                @click="updateProfilePicture"
                :loading="updatingProfilePicture"
            ></Button>
        </div>
    </Dialog>
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
    width: 170px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    overflow: hidden;
}
.profile-info .name {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}
.profile-image .p-image {
    border-color: var(--header-shadow) !important;
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
.p-tabs {
    background: var(--box-bg);
}
.page-content .p-tabpanels {
    padding: 1.25rem 2rem;
}
.remove-profile {
    border: none;
    outline: none;
    width: 35px;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    background: #dc3545;
    color: #fff;
    position: absolute !important;
    right: 0;
    top: 0;
    z-index: 100;
}
</style>
