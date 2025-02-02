<script setup>
import chatsData from '@/mocks/chats.json';
import helpers from '@/utils/helpers';
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const search = ref('');
const loading = ref(false);
const filteredResults = ref([...chatsData]);

onBeforeMount(() => {
    searchResults();
});

const searchResults = (query) => {
    loading.value = true;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                !query
                    ? [...chatsData]
                    : chatsData.filter((item) =>
                          item.full_name
                              .toLowerCase()
                              .includes(query.toLowerCase())
                      )
            );
            loading.value = false;
        }, 1500);
    });
};

watch(search, async (newSearch) => {
    filteredResults.value = await searchResults(newSearch);
});
</script>
<template>
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
    <div
        :class="{
            'chats-wrapper': true,
            scroll: filteredResults.length > 7
        }"
        v-if="filteredResults.length > 0"
    >
        <div v-if="loading">
            <div class="chat" v-for="index in 4" :key="'skeleton-' + index">
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
        <Menu
            :model="filteredResults"
            class="bg-transparent border-none"
            v-else
        >
            <template #item="{ item }">
                <router-link :to="item.username" v-ripple class="w-full chat">
                    <div class="chat-avatar">
                        <img
                            :src="item.profile_picture"
                            :alt="item.full_name"
                            width="30"
                            height="30"
                            class="border-circle"
                        />
                    </div>
                    <div class="chat-content">
                        <div class="wrapper">
                            <div class="name">{{ item.full_name }}</div>
                            <div class="date">
                                {{ helpers.formatDate(item.last_message_date) }}
                            </div>
                        </div>
                        <div class="message">
                            <i class="bx bx-check-double seen"></i>
                            <div class="text">
                                {{ item.last_message }}
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
</template>
<style>
.chats-wrapper {
    height: 80vh;
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
.chat-avatar {
    width: 60px;
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
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 1px;
}

.chat-content .message {
    display: flex;
    align-items: center;
    gap: 0.2rem;
}
.chat-content .message .text {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-gray-color);
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
</style>
