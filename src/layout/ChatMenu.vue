<script setup>
import helpers from '@/utils/helpers';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useUserStore, useChatStore } from '@/stores';
import { useRouter, useRoute } from 'vue-router';
import useEventsBus from '@/utils/event-bus';

const { bus } = useEventsBus();
const userStore = useUserStore();
const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const search = ref('');
const loading = ref(false);
const conversations = ref([]);
const onlineUsers = ref([]);
const filteredConversations = ref([]);

watch(
    () => bus.value.get('reloadMessages'),
    async () => {
        await getConversationsData();
    }
);

watch(search, (newSearch) => {
    if (!newSearch) {
        filteredConversations.value =
            conversations.value?.length > 0 ? conversations.value : [];
    } else {
        const onlineRecipients = onlineUsers.value.map((user) =>
            normalizeUserAsRecipient(user)
        );
        const allItems = [...(conversations.value || []), ...onlineRecipients];

        const uniqueItems = [];
        const seenUsernames = new Set();
        for (const item of allItems) {
            const username = item.recipient.username;
            if (!seenUsernames.has(username)) {
                seenUsernames.add(username);
                uniqueItems.push(item);
            }
        }

        filteredConversations.value = uniqueItems.filter((item) =>
            item.recipient.name.toLowerCase().includes(newSearch.toLowerCase())
        );
    }
});

onBeforeMount(async () => {
    await getConversations();
    await getOnlineUsers();
});

const getConversationsData = async () => {
    const res = await chatStore.getConversations();
    conversations.value = res?.length > 0 ? res : [];

    if (!search.value) {
        filteredConversations.value = conversations.value;
    }
};

const getConversations = async () => {
    try {
        loading.value = true;
        await getConversationsData();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const normalizeUserAsRecipient = (user) => {
    return {
        recipient: {
            id: user.id,
            username: user.username,
            name: user.name,
            profile_picture: user.profile_picture || 'default-avatar.png'
        },
        last_message: null,
        unread_count: 0
    };
};

const getOnlineUsers = async () => {
    try {
        const res = await userStore.getOnlineFriends();
        onlineUsers.value = res?.length > 0 ? res : [];
    } catch (error) {
        console.error(error);
    }
};

const setCurrentChatUser = (user) => {
    console.log(user);
    chatStore.setCurrentChatUser(user);
};

const isActive = (username) => route.params.username === username;
</script>
<template>
    <div class="chat-menu">
        <div class="flex align-items-center gap-3 px-3 py-3">
            <Button
                @click="router.push({ name: 'home' })"
                icon="icon pi pi-arrow-left"
                variant="text"
                rounded
                class="text-black-alpha-90 back-btn"
            />
            <div class="page-title page-title--lg mb-1">Chats</div>
        </div>
        <div class="px-3 pb-2">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    v-model="search"
                    placeholder="Search"
                    class="global-search"
                />
            </IconField>
        </div>
        <div v-if="loading">
            <div class="chat" v-for="index in 7" :key="'skeleton-' + index">
                <div class="chat-avatar">
                    <Skeleton shape="circle" size="48px"></Skeleton>
                </div>
                <div class="chat-content">
                    <Skeleton
                        width="7rem"
                        height="10px"
                        borderRadius="100px"
                    ></Skeleton>
                    <Skeleton
                        class="mt-1"
                        width="4rem"
                        height="10px"
                        borderRadius="100px"
                    ></Skeleton>
                </div>
            </div>
        </div>
        <div
            v-else
            :class="{
                'chats-wrapper': true,
                scroll: filteredConversations.length > 7
            }"
        >
            <div v-if="filteredConversations.length > 0 && !loading">
                <Menu
                    :model="filteredConversations"
                    class="bg-transparent border-none"
                >
                    <template #item="{ item }">
                        <router-link
                            @click="setCurrentChatUser(item)"
                            :to="item.recipient.username"
                            v-ripple
                            :class="[
                                'w-full chat',
                                { open: isActive(item.recipient.username) }
                            ]"
                        >
                            <div class="chat-avatar">
                                <img
                                    :src="item.recipient.profile_picture"
                                    :alt="item.recipient.name"
                                    width="30"
                                    height="30"
                                    class="border-circle"
                                />
                            </div>
                            <div class="chat-content">
                                <div class="wrapper">
                                    <div class="name">
                                        {{ item.recipient.name }}
                                    </div>
                                    <div
                                        v-if="item.last_message"
                                        :class="[
                                            'date',
                                            {
                                                green:
                                                    item.recipient
                                                        .unread_count > 0
                                            }
                                        ]"
                                    >
                                        {{
                                            helpers.formatTime(
                                                item.last_message.created_at
                                            )
                                        }}
                                    </div>
                                </div>
                                <div class="wrapper" v-if="item.last_message">
                                    <div class="message">
                                        <i
                                            v-if="item.last_message.is_mine"
                                            :class="[
                                                'bx',
                                                'bx-check-double',
                                                {
                                                    seen: item.last_message
                                                        .read_at
                                                }
                                            ]"
                                        ></i>
                                        <div class="text">
                                            {{ item.last_message.message }}
                                        </div>
                                    </div>
                                    <div
                                        class="unread"
                                        v-if="item.unread_count > 0"
                                    >
                                        {{ item.unread_count }}
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </template>
                </Menu>
            </div>
            <div
                class="text-sm w-full mt-8 pt-8 text-center"
                v-else
                style="color: var(--text-gray-color)"
            >
                No results
            </div>
        </div>
    </div>
</template>
<style>
.chat-menu {
    background: var(--header-bg);
    border-right: 1px solid var(--header-shadow);
    padding-right: 0.35rem;
}
.chats-wrapper {
    height: calc(100vh - 7.5rem);
}
.chats-wrapper.scroll {
    overflow-y: auto;
}
.chats-wrapper::-webkit-scrollbar {
    width: 3px;
}
.p-menu-list {
    gap: 0 !important;
}
.chat {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.95rem;
    padding: 0.71rem 1.25rem;
}
.chat:hover {
    background: var(--items-hover-bg);
}
.chat.open {
    background: var(--chat-active-bg);
}
.chat-avatar {
    width: 60px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    overflow: hidden;
}

.chat-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.chat-content .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chat-content {
    width: 100%;
}

.chat-content .name {
    color: var(--text-color);
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 2px;
}

.chat-content .message {
    display: flex;
    align-items: center;
    gap: 0.2rem;
}
.chat-content .unread {
    width: 16px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    font-size: 0.7rem;
    background: #1daa61;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}
.chat-content .message .text {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-gray-color);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.chat-content .message i {
    font-size: 1.3rem;
    color: var(--text-gray-color);
    transition: all 300ms;
}
.chat-content .message i.seen {
    color: #007bfc;
}
.chat-content .date {
    color: var(--text-gray-color);
    font-size: 0.8rem;
    font-weight: 400;
}
.chat-content .green {
    color: #1daa61;
}
</style>
