<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Logo from '@/assets/images/c.png';
import GlobalSearch from '@/components/GlobalSearch.vue';
import Placeholder from '@/assets/images/placeholder-user.png';
import notifications from '@/mocks/notifications.json';
import unreadNotifications from '@/mocks/unreadNotifications.json';

const user = {
    full_name: 'Arham Khan',
    username: 'arhamkhan'
};

const NAV_ITEMS = [
    { to: 'home', icon: 'fa-solid fa-house' },
    { to: 'friends', icon: 'fa-solid fa-users' },
    { to: 'my-friends', icon: 'fa-solid fa-user-group' }
];

const route = useRoute();
const optionBoxWrapper = ref(null);
const activeTab = computed(() => route.name);
const showOptionBox = ref(false);
const contentType = ref(null);
const dark = ref(null);
const triggerElements = ref(
    new Map([
        ['account', ref(null)],
        ['notifications', ref(null)]
    ])
);

const handleClickOutside = (event) => {
    const isOutsideBox = !optionBoxWrapper.value?.contains(event.target);
    const isOutsideTriggers = Array.from(triggerElements.value.values()).every(
        (ref) => !ref.value?.$el.contains(event.target)
    );

    if (showOptionBox.value && isOutsideBox && isOutsideTriggers) {
        showOptionBox.value = false;
    }
};

const toggleOptionBox = (type) => {
    contentType.value =
        showOptionBox.value && contentType.value === type ? null : type;
    showOptionBox.value = contentType.value !== null;
};

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

watch(showOptionBox, (visible) => {
    document[visible ? 'addEventListener' : 'removeEventListener'](
        'click',
        handleClickOutside
    );
});
</script>

<template>
    <header class="header flex align-items-center justify-content-between px-3">
        <div class="header-logo">
            <router-link :to="{ name: 'home' }">
                <img :src="Logo" width="30" class="mt-1" alt="logo" />
            </router-link>
            <GlobalSearch />
        </div>

        <div class="header-nav">
            <Tabs :value="activeTab">
                <TabList>
                    <Tab
                        v-for="tab in NAV_ITEMS"
                        :key="tab.to"
                        class="header-tab"
                        :value="tab.to"
                    >
                        <router-link
                            :to="{ name: tab.to }"
                            v-slot="{ href, navigate }"
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
                        v-tooltip.bottom="'messenger'"
                        class="header-options__item cursor-pointer"
                    >
                        <i class="fa-brands fa-facebook-messenger" />
                    </OverlayBadge>
                </router-link>
            </li>
            <li>
                <OverlayBadge
                    :ref="
                        (el) =>
                            (triggerElements.get('notifications').value = el)
                    "
                    @click="toggleOptionBox('notifications')"
                    severity="danger"
                    v-tooltip.bottom="'notifications'"
                    class="header-options__item no-badge cursor-pointer"
                >
                    <i class="fa-solid fa-bell" />
                </OverlayBadge>
            </li>
            <li>
                <OverlayBadge
                    :ref="(el) => (triggerElements.get('account').value = el)"
                    @click="toggleOptionBox('account')"
                    v-tooltip.bottom="'account'"
                    severity="danger"
                    class="header-options__item no-badge cursor-pointer"
                >
                    <img
                        :src="Placeholder"
                        class="border-circle"
                        alt="account"
                        width="43"
                        height="43"
                    />
                </OverlayBadge>
            </li>
        </ul>

        <div v-if="showOptionBox" class="option-box" ref="optionBoxWrapper">
            <template v-if="contentType === 'account'">
                <router-link
                    @click="showOptionBox = false"
                    :to="{
                        name: 'user-detail',
                        params: { username: user.username }
                    }"
                    class="user-profile"
                    v-ripple
                >
                    <div class="profile-picture">
                        <img
                            :src="Placeholder"
                            class="border-circle"
                            alt="account"
                            width="36"
                            height="36"
                        />
                    </div>
                    <div class="name">{{ user.full_name }}</div>
                </router-link>
                <div class="lookups-list">
                    <div
                        class="lookups-item cursor-pointer pr-4"
                        v-ripple
                        @click.stop="contentType = 'appearance'"
                    >
                        <div class="wrapper">
                            <div class="icon">
                                <i class="fa-solid fa-moon" />
                            </div>
                            <div class="title">Appearance</div>
                        </div>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <div class="lookups-item" v-ripple>
                        <div class="wrapper">
                            <div class="icon">
                                <i class="fa-solid fa-right-from-bracket" />
                            </div>
                            <div class="title">Logout</div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="contentType === 'notifications'">
                <div class="option-box__header">
                    <div class="title">Notifications</div>
                </div>
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">All</Tab>
                        <Tab value="1">Unread</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <div
                                :class="[
                                    'lookups-list border-none mt-0',
                                    { scroll: notifications.length > 4 }
                                ]"
                            >
                                <div
                                    v-for="(
                                        notification, index
                                    ) in notifications"
                                    :key="index"
                                    class="lookups-item lookups-item--notify"
                                    v-ripple
                                >
                                    <div class="wrapper">
                                        <div class="icon">
                                            <img
                                                :src="Placeholder"
                                                class="border-circle"
                                                alt="account"
                                                width="56"
                                                height="56"
                                            />
                                        </div>
                                        <div>
                                            <div class="title">
                                                <span>{{
                                                    notification.name
                                                }}</span>
                                                {{ notification.message }}
                                            </div>
                                            <div
                                                class="time"
                                                v-tooltip.top="
                                                    `${notification.name} ${notification.message}`
                                                "
                                            >
                                                {{ notification.time }}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-if="!notification.is_read"
                                        class="read-dot"
                                    ></div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="1">
                            <div
                                :class="[
                                    'lookups-list border-none mt-0',
                                    { scroll: unreadNotifications.length > 4 }
                                ]"
                            >
                                <div
                                    v-for="(
                                        notification, index
                                    ) in unreadNotifications"
                                    :key="index"
                                    class="lookups-item lookups-item--notify"
                                    v-ripple
                                >
                                    <div class="wrapper">
                                        <div class="icon">
                                            <img
                                                :src="Placeholder"
                                                class="border-circle"
                                                alt="account"
                                                width="56"
                                                height="56"
                                            />
                                        </div>
                                        <div>
                                            <div class="title">
                                                <span>{{
                                                    notification.name
                                                }}</span>
                                                {{ notification.message }}
                                            </div>
                                            <div
                                                class="time"
                                                v-tooltip.top="
                                                    `${notification.name} ${notification.message}`
                                                "
                                            >
                                                {{ notification.time }}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-if="!notification.is_read"
                                        class="read-dot"
                                    ></div>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </template>
            <template v-else-if="contentType === 'appearance'">
                <div
                    class="option-box__header flex align-items-center gap-2 pb-0 px-2"
                >
                    <Button
                        @click.stop="contentType = 'account'"
                        icon="icon pi pi-arrow-left"
                        variant="text"
                        rounded
                        class="text-black-alpha-90 back-btn"
                    />
                    <div class="title pl-1">Appearance</div>
                </div>
                <div class="actions-list">
                    <div class="actions-item">
                        <div class="icon">
                            <i class="fa-solid fa-moon" />
                        </div>
                        <div class="content">
                            <div class="title">Dark mode</div>
                            <p>
                                Adjust the appearance of App to reduce glare and
                                give your eyes a break.
                            </p>
                            <label for="off" class="action-option mt-3"
                                >Off
                                <RadioButton
                                    v-model="dark"
                                    inputId="off"
                                    value="0"
                                />
                            </label>
                            <label for="on" class="action-option"
                                >On
                                <RadioButton
                                    v-model="dark"
                                    inputId="on"
                                    value="1"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </header>
</template>

<style>
.actions-list {
    margin: 1rem 0;
}

.actions-item {
    display: flex;
    gap: 0.9rem;

    padding: 1rem 0.5rem 0;
}

.actions-item .title {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.actions-item p {
    color: #838689;
    font-size: 0.8rem;
}

.actions-item .icon {
    align-self: flex-start;
    background: #e0e6ee;
    color: #1c1d21;
    width: 36px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.actions-item .content {
    flex: 1;
}

.action-option {
    width: 100%;
    padding: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    color: #6b6b6c;
    font-size: 0.85rem;
    font-weight: 500;
}

.action-option:hover {
    background: #f2f2f2;
}

.header-options li {
    position: relative;
}

.option-box {
    color: #121213;
    width: 345px;
    position: absolute;
    top: 100%;
    right: 1rem;
    border-radius: 0.5rem;
    z-index: 100;
    background: #fff;
    box-shadow: 0 0 15px 5px #00000020;
    padding: 0.5rem;
}

.option-box__header {
    padding: 0.5rem 0.75rem;
}

.option-box__header .title {
    font-size: 1.4rem;
    font-weight: 700;
}

.user-profile {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.5rem;
    border-radius: 0.5rem;
}

.user-profile:hover {
    background: #f2f2f2;
}

.lookups-list.scroll {
    height: 70vh;
    overflow-y: auto;
}

.user-profile .name {
    font-size: 1rem;
    font-weight: 700;
}

.lookups-list {
    border-top: 1px solid #cccccc7a;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}

.lookups-item {
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0.5rem;
}

.lookups-item--notify {
    padding-inline: 1.25rem;
}

.lookups-item--notify .read-dot {
    width: 15px;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    background: var(--primary-color);
    flex: 0.043;
}

.lookups-item .time {
    width: fit-content;
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 0.2rem;
    color: var(--primary-color);
}

.lookups-item .wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.lookups-item--notify .wrapper {
    gap: 1.5rem;
    flex: 1;
}

.lookups-item:hover {
    background: #f2f2f2;
}

.lookups-item .icon {
    background: #e0e6ee;
    color: #1c1d21;
    width: 36px;
    aspect-ratio: 1/1;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.lookups-item .title {
    font-size: 0.9rem;
    font-weight: 500;
}

.lookups-item--notify .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    color: #6e7174;
    font-weight: 400;
}

.lookups-item--notify .title span {
    color: #626569;
    font-weight: 600;
}

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
    --p-tabs-tab-border-width: 0 0 3px 0;
}

.header-logo {
    width: 34%;
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
    transition: all 100ms;
    --p-badge-height: 1.1rem;
}

.header-options__item:hover {
    filter: brightness(0.95);
}

.header-options .p-badge {
    top: 0.5rem !important;
    right: 0.2rem !important;
}

.no-badge .p-badge {
    display: none !important;
}

body .p-tabpanels {
    padding: 0;
}

body .p-tablist-tab-list {
    border: none;
}
</style>
