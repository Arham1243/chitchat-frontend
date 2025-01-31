<script setup>
import results from '@/mocks/users.json';
import { ref, onMounted, onUnmounted, watch } from 'vue';

const showSearchResults = ref(false);
const loading = ref(false);
const search = ref('');
const searchWrapper = ref(null);
const filteredResults = ref([]);

const handleClickOutside = (event) => {
    if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
        showSearchResults.value = false;
    }
};
const reset = () => {
    showSearchResults.value = false;
    search.value = '';
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const searchResults = (query) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query) {
                resolve([...results]);
            } else {
                resolve(
                    results.filter((item) =>
                        item.full_name
                            .toLowerCase()
                            .includes(query.toLowerCase())
                    )
                );
            }
        }, 1500);
    });
};

watch(search, async (newSearch) => {
    loading.value = true;
    const results = await searchResults(newSearch);
    filteredResults.value = results;
    loading.value = false;
});
</script>

<template>
    <div class="search-field-wrapper" ref="searchWrapper">
        <div class="icon-field-wrapper">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    v-model="search"
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
                class="text-black-alpha-90"
            />
            <div
                :class="{
                    'search-results': true,
                    scroll: !loading && filteredResults.length > 7
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
                <template v-if="filteredResults.length">
                    <router-link
                        @click="reset"
                        :to="{
                            name: 'user-detail',
                            params: { username: result.username }
                        }"
                        v-show="!loading"
                        class="result"
                        v-for="(result, index) in filteredResults"
                        :key="index"
                        v-ripple
                    >
                        <div class="avatar">
                            <img
                                :src="result.profile_picture"
                                :alt="result.full_name"
                                class="imgFluid"
                                v-if="result.is_friend == 'yes'"
                            />
                            <i
                                v-else-if="
                                    result.is_friend === 'no' ||
                                    result.is_friend === 'pending'
                                "
                                class="fa fa-search"
                            ></i>
                        </div>
                        <div class="info">
                            <div class="name">{{ result.full_name }}</div>
                            <div class="type" v-if="result.is_friend === 'yes'">
                                friend
                            </div>
                            <div
                                class="type"
                                v-if="
                                    result.is_friend === 'no' ||
                                    result.is_friend === 'pending'
                                "
                            >
                                people
                            </div>
                        </div>
                        <div
                            class="picture"
                            v-if="
                                result.is_friend === 'no' ||
                                result.is_friend === 'pending'
                            "
                        >
                            <img
                                :src="result.profile_picture"
                                :alt="result.full_name"
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
    background: #f0f2f5;
    padding: 0.77rem 1rem;
    padding-left: 2.5rem !important;
    border: none;
}
.icon-field-wrapper {
    background: #fff;
    position: relative;
    z-index: 101;
}
body .search-field-wrapper .p-button {
    position: absolute !important;
    left: 0.85rem;
    top: 0.25rem;
}
body .search-field-wrapper .p-button .icon {
    font-size: 0.85rem;
}
body .search-field-wrapper .p-button:hover {
    background: #f0f2f5;
}
body .header-logo .p-inputicon {
    margin-left: 0.15rem;
}
.search-field-wrapper {
    position: relative;
}
.search-options {
    position: absolute;
    width: 135%;
    top: -0.25rem;
    left: 40%;
    transform: translateX(-50%);
    border-radius: 0.5rem;
    z-index: 100;
    background: #fff;
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
    background: #f2f4f7;
    color: #65686c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}
.search-results .name {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.15rem;
}
.search-results .type {
    font-size: 0.8rem;
    color: #8d9093;
    text-transform: capitalize;
}
.search-results :is(.avatar, .picture) {
    width: 37px;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    overflow: hidden;
}
</style>
