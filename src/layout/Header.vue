<script setup>
import Logo from '@/assets/images/logo.png';
import GlobalSearch from '@/components/GlobalSearch.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const items = ref([
    { to: 'home', icon: 'fa-solid fa-house' },
    {
        to: 'friends',
        icon: 'fa-solid fa-users'
    },
    { to: 'my-friends', icon: 'fa-solid fa-user-group' }
]);
const activeTab = computed(() => route.name);
</script>
<template>
    <header class="header flex align-items-center justify-content-between px-3">
        <div class="header-logo">
            <router-link :to="{ name: 'home' }">
                <img :src="Logo" width="120" class="mt-1" alt="logo" />
            </router-link>
            <GlobalSearch />
        </div>

        <div class="header-nav">
            <Tabs :value="activeTab">
                <TabList>
                    <Tab
                        class="header-tab"
                        v-for="tab in items"
                        :key="tab.label"
                        :value="tab.to"
                    >
                        <router-link
                            v-if="tab.to"
                            v-slot="{ href, navigate }"
                            :to="{ name: tab.to }"
                            custom
                        >
                            <a
                                v-ripple
                                :href="href"
                                @click="navigate"
                                class="flex items-center gap-2 text-inherit"
                            >
                                <i :class="tab.icon" />
                            </a>
                        </router-link>
                    </Tab>
                </TabList>
            </Tabs>
        </div>
        <ul class="header-options flex align-items-center justify-content-end">
            <li>
                <router-link :to="{ name: 'home' }">
                    <OverlayBadge
                        severity="danger"
                        value="0"
                        class="header-options__item"
                    >
                        <i class="fa-brands fa-facebook-messenger" />
                    </OverlayBadge>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'home' }">
                    <OverlayBadge
                        severity="danger"
                        class="header-options__item no-badge"
                    >
                        <i class="fa-solid fa-bell" />
                    </OverlayBadge>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'home' }">
                    <OverlayBadge
                        severity="danger"
                        class="header-options__item no-badge"
                    >
                        <i class="fa-solid fa-user" />
                    </OverlayBadge>
                </router-link>
            </li>
        </ul>
    </header>
</template>
<style>
.header {
    background: #fff;
    box-shadow: 0 0 15px 5px #00000020;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
}
.header-nav {
    width: 33%;
}
.header-tab {
    width: 28%;
}
.header-nav .p-tablist-tab-list {
    justify-content: center;
    gap: 1rem;
}
.header-options {
    width: 33%;
    padding-top: 2px;
    gap: 0.85rem;
}
.header-tab i {
    font-size: 1.35rem;
    color: #606366;
    top: 1px;
    position: relative;
}
.header-nav .p-tab-active i {
    color: var(--primary-color);
}
.header-nav .p-tab {
    display: flex;
    justify-content: center;
}
.header-nav button.p-tab {
    padding: 0;
}
.header-nav button.p-tab > a {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.125rem;
}
.header-nav .p-tab-active {
    border-bottom-width: 3px;
}
.header-logo {
    width: 33%;
    display: flex;
    align-items: center;
    gap: 1rem;
}
.header-options__item {
    width: 2.75rem;
    background: #e2e8f0;
    color: #000;
    aspect-ratio: 1/1;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    --p-badge-min-width: 1.1rem;
    --p-badge-height: 1.1rem;
}
.header-options .p-badge {
    top: 0.5rem !important;
    right: 0.2rem !important;
}
.no-badge .p-badge {
    display: none !important;
}
</style>
