<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const showSearchResults = ref(false);
const loading = ref(false);
const searchWrapper = ref(null);
const searchQuery = ref('');
const users = ref([]);
let debounceTimeout = null;

const handleClickOutside = (event) => {
    if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
        showSearchResults.value = false;
    }
};

const reset = () => {
    showSearchResults.value = false;
    searchQuery.value = '';
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const searchUsers = async (query) => {
    const payload = { search: query };
    try {
        const res = await userStore.searchUsers(payload);
        return res;
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
};

const handleSearchInput = (event) => {
    const query = event.target.value;
    searchQuery.value = query;

    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(async () => {
        if (query.trim() !== '') {
            loading.value = true;
            const results = await searchUsers(query);
            users.value = results;
            loading.value = false;
        } else {
            users.value = [];
        }
    }, 500);
};
</script>

<template>
    <div class="search-field-wrapper" ref="searchWrapper">
        <div class="icon-field-wrapper">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    v-model="searchQuery"
                    @input="handleSearchInput"
                    @search="searchUsers"
                    placeholder="Search friends"
                    class="global-search"
                    @click="showSearchResults = true"
                />
            </IconField>
        </div>
        <div class="search-options" v-if="showSearchResults">
            <Button
                @click="showSearchResults = false"
                icon="icon pi pi-arrow-left"
                variant="text"
                rounded
                class="text-black-alpha-90 back-btn"
            />
            <div
                :class="{
                    'search-results': true,
                    scroll: !loading && users.length > 7
                }"
            >
                <div v-if="loading">
                    <div
                        class="result"
                        v-for="index in 2"
                        :key="'skeleton-' + index"
                    >
                        <div class="avatar">
                            <Skeleton shape="circle" size="37px"></Skeleton>
                        </div>
                        <div class="info">
                            <Skeleton
                                width="7rem"
                                height="10px"
                                borderRadius="100px"
                            ></Skeleton>
                            <Skeleton
                                width="3rem"
                                height="9px"
                                borderRadius="100px"
                                class="mt-1"
                            ></Skeleton>
                        </div>
                    </div>
                </div>
                <template v-if="users.length">
                    <router-link
                        @click="reset"
                        :to="{
                            name: 'user-detail',
                            params: { username: result.username }
                        }"
                        v-show="!loading"
                        class="result"
                        v-for="(result, index) in users"
                        :key="index"
                        v-ripple
                    >
                        <div class="avatar">
                            <img
                                :src="result.profile_picture"
                                :alt="result.name"
                                class="imgFluid"
                                v-if="
                                    result.friend_request_status == 'accepted'
                                "
                            />
                            <i
                                v-else-if="
                                    result.friend_request_status == null ||
                                    result.friend_request_status == 'pending'
                                "
                                class="fa fa-search"
                            ></i>
                        </div>
                        <div class="info">
                            <div class="name">{{ result.name }}</div>
                            <div
                                class="type"
                                v-if="
                                    result.friend_request_status == 'accepted'
                                "
                            >
                                friend
                            </div>
                            <div
                                class="type"
                                v-if="
                                    result.friend_request_status == null ||
                                    result.friend_request_status == 'pending'
                                "
                            >
                                people
                            </div>
                        </div>
                        <div
                            class="picture"
                            v-if="
                                result.friend_request_status == null ||
                                result.friend_request_status == 'pending'
                            "
                        >
                            <img
                                :src="result.profile_picture"
                                :alt="result.name"
                                class="imgFluid"
                            />
                        </div>
                    </router-link>
                </template>
                <div v-else class="result text-center" v-show="!loading">
                    <div class="info pb-1">
                        <div class="type mr-4" style="text-transform: inherit">
                            No results found.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
body .global-search {
    width: 100%;
    font-size: 0.8rem;
    border-radius: 100px;
    color: var(--text-placeholder-color);
    background: var(--field-bg);
    padding: 0.77rem 1rem;
    padding-left: 2.5rem !important;
    border: none;
    transition: none;
}
body .global-search::placeholder {
    color: var(--text-placeholder-color);
}
.icon-field-wrapper {
    position: relative;
    z-index: 101;
}
body .search-field-wrapper .p-button {
    position: absolute !important;
    left: 0.85rem;
    top: 0.25rem;
}
body .header-logo .p-inputicon {
    margin-left: 0.15rem;
    color: var(--text-placeholder-color);
}
.search-field-wrapper {
    position: relative;
}
.search-options {
    color: var(--text-color);
    position: absolute;
    width: 130%;
    top: -0.25rem;
    left: 40%;
    transform: translateX(-50%);
    border-radius: 0.5rem;
    z-index: 100;
    background: var(--option-bg);
    box-shadow: 0 0 15px 5px #00000020;
    padding-top: 4rem;
    padding-bottom: 0.5rem;
}
.search-results.scroll {
    height: 25.5rem;
    overflow-y: auto;
}

.search-results .result {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.65rem 1.25rem;
    user-select: none;
    cursor: pointer;
}
.search-results .info {
    flex: 1;
}
.search-results .avatar {
    background: var(--option-btn-bg);
    color: var(--icon-gray-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}
.search-results .name {
    color: var(--text-color);
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.15rem;
}
.search-results .type {
    font-size: 0.8rem;
    color: var(--text-gray-color);
    text-transform: capitalize;
}
.search-results :is(.avatar, .picture) {
    width: 37px;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    overflow: hidden;
}
</style>
