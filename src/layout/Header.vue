<script setup>
import {
    ref,
    computed,
    onUnmounted,
    watch,
    onBeforeMount,
    onMounted
} from 'vue';
import { useRoute } from 'vue-router';
import helpers from '@/utils/helpers';
import { useAuthStore, useNotificationStore } from '@/stores';
import { useRouter } from 'vue-router';
import Logo from '@/assets/images/c.png';
import GlobalSearch from '@/components/GlobalSearch.vue';
import { echo } from '@/plugins/echo';

const NAV_ITEMS = [
    { to: 'home', icon: 'fa-solid fa-house' },
    { to: 'friends', icon: 'fa-solid fa-users' },
    { to: 'my-friends', icon: 'fa-solid fa-user-group' }
];

const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const optionBoxWrapper = ref(null);
const activeTab = computed(() => route.name);
const showOptionBox = ref(false);
const loadingNotifications = ref(false);
const loadingUnreadNotifications = ref(false);
const contentType = ref(null);
const notifications = ref([]);
const unreadNotifications = ref([]);
const dark = ref(localStorage.getItem('darkMode') || '0');
const user = computed(() => authStore.currentUser);
const triggerElements = ref(
    new Map([
        ['account', ref(null)],
        ['notifications', ref(null)]
    ])
);

onBeforeMount(async () => {
    await getNotifications();
    await getUnreadNotifications();
});
watch(dark, () => {
    toggleTheme();
});
onMounted(async () => {
    echo.channel(`users`).listen('.new', async (data) => {
        setTimeout(async () => {
            await getNotifications();
            await getUnreadNotifications();
            showNotification(data.name, data.message);
        }, 1500);
    });
});

const showNotification = (sender, message) => {
    if (Notification.permission === 'granted') {
        new Notification(sender?.name || 'New Message', {
            body: `${sender} ${message}`,
            icon: Logo
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                showNotification(sender, message, Logo);
            }
        });
    }
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

const toggleTheme = () => {
    if (dark.value === '1') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', dark.value);
};

const pushRoute = (name) => {
    router.push({ name });
};

const handleClickOutside = (event) => {
    const isOutsideBox = !optionBoxWrapper.value?.contains(event.target);
    const isOutsideTriggers = Array.from(triggerElements.value.values()).every(
        (ref) => !ref.value?.$el.contains(event.target)
    );

    if (showOptionBox.value && isOutsideBox && isOutsideTriggers) {
        showOptionBox.value = false;
    }
};

const logout = async () => {
    try {
        await authStore.logout();
        pushRoute('login');
    } catch (error) {
        console.log(error);
    }
};

const getNotifications = async () => {
    try {
        loadingNotifications.value = true;
        const res = await notificationStore.getNotifications();
        notifications.value = res;
    } catch (error) {
        console.log(error);
    } finally {
        loadingNotifications.value = false;
    }
};
const getUnreadNotifications = async () => {
    try {
        loadingUnreadNotifications.value = true;
        const res = await notificationStore.getUnreadNotifications();
        unreadNotifications.value = res;
    } catch (error) {
        console.log(error);
    } finally {
        loadingUnreadNotifications.value = false;
    }
};

const markAsRead = async (notification) => {
    try {
        showOptionBox.value = false;
        if (!notification.read_at) {
            await notificationStore.markAsRead(notification.id);
            await getNotifications();
            await getUnreadNotifications();
        }
    } catch (error) {
        console.log(error);
    }
};

const toggleOptionBox = (type) => {
    contentType.value =
        showOptionBox.value && contentType.value === type ? null : type;
    showOptionBox.value = contentType.value !== null;
};
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
                <router-link
                    :to="{ name: 'chats', params: { username: '-1' } }"
                >
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
                    :value="unreadNotifications.length"
                    :ref="
                        (el) =>
                            (triggerElements.get('notifications').value = el)
                    "
                    @click="toggleOptionBox('notifications')"
                    severity="danger"
                    v-tooltip.bottom="'notifications'"
                    :class="[
                        'header-options__item',
                        'cursor-pointer',
                        { 'no-badge': unreadNotifications.length === 0 }
                    ]"
                >
                    <i
                        :class="[
                            'fa-solid',
                            unreadNotifications.length > 0
                                ? 'fa-bell fa-shake'
                                : 'fa-bell'
                        ]"
                    />
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
                        :src="user.profile_picture"
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
                            :src="user.profile_picture"
                            class="border-circle"
                            alt="account"
                            width="36"
                            height="36"
                        />
                    </div>
                    <div class="name">{{ user.name }}</div>
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
                    <div
                        class="lookups-item cursor-pointer"
                        v-ripple
                        @click="logout"
                    >
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
                            <template v-if="!loadingNotifications">
                                <template v-if="notifications.length > 0">
                                    <div
                                        :class="[
                                            'lookups-list border-none mt-0',
                                            { scroll: notifications.length > 4 }
                                        ]"
                                    >
                                        <router-link
                                            :to="{ name: 'my-friends' }"
                                            v-for="(
                                                notification, index
                                            ) in notifications"
                                            :key="index"
                                            class="lookups-item lookups-item--notify"
                                            v-ripple
                                            @click="markAsRead(notification)"
                                        >
                                            <div class="wrapper">
                                                <div class="icon">
                                                    <img
                                                        :src="
                                                            notification.sender
                                                                ?.profile_picture
                                                        "
                                                        class="border-circle"
                                                        :alt="
                                                            notification.sender
                                                                ?.name
                                                        "
                                                        width="56"
                                                        height="56"
                                                    />
                                                </div>
                                                <div>
                                                    <div class="title">
                                                        <span>{{
                                                            notification.sender
                                                                ?.name
                                                        }}</span>
                                                        {{
                                                            notification.data
                                                                .message
                                                        }}
                                                    </div>
                                                    <div class="time">
                                                        {{
                                                            helpers.formatDateAgo(
                                                                notification.created_at
                                                            )
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                v-if="!notification.read_at"
                                                class="read-dot"
                                            ></div>
                                        </router-link>
                                    </div>
                                </template>

                                <template v-else>
                                    <div
                                        class="flex flex-column text-center justify-content-center py-4 gap-3"
                                        style="color: var(--text-gray-color)"
                                    >
                                        <i
                                            class="text-7xl fa-solid fa-bell"
                                        ></i>
                                        <div class="text-base font-bold">
                                            You have no notifications
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <ProgressSpinner
                                    style="width: 30px; height: 30px"
                                    class="my-3 mx-auto block"
                                    strokeWidth="3"
                                    fill="transparent"
                                />
                            </template>
                        </TabPanel>
                        <TabPanel value="1">
                            <template v-if="!loadingUnreadNotifications">
                                <template v-if="unreadNotifications.length > 0">
                                    <div
                                        :class="[
                                            'lookups-list border-none mt-0',
                                            {
                                                scroll:
                                                    unreadNotifications.length >
                                                    4
                                            }
                                        ]"
                                    >
                                        <router-link
                                            :to="{ name: 'my-friends' }"
                                            v-for="(
                                                notification, index
                                            ) in unreadNotifications"
                                            :key="index"
                                            class="lookups-item lookups-item--notify"
                                            v-ripple
                                            @click="markAsRead(notification)"
                                        >
                                            <div class="wrapper">
                                                <div class="icon">
                                                    <img
                                                        :src="
                                                            notification.sender
                                                                ?.profile_picture
                                                        "
                                                        class="border-circle"
                                                        :alt="
                                                            notification.sender
                                                                ?.name
                                                        "
                                                        width="56"
                                                        height="56"
                                                    />
                                                </div>
                                                <div>
                                                    <div class="title">
                                                        <span>{{
                                                            notification.sender
                                                                ?.name
                                                        }}</span>
                                                        {{
                                                            notification.data
                                                                .message
                                                        }}
                                                    </div>
                                                    <div class="time">
                                                        {{
                                                            helpers.formatDateAgo(
                                                                notification.created_at
                                                            )
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                v-if="!notification.read_at"
                                                class="read-dot"
                                            ></div>
                                        </router-link>
                                    </div>
                                </template>
                                <template v-else>
                                    <div
                                        class="flex flex-column text-center justify-content-center py-4 gap-3"
                                        style="color: var(--text-gray-color)"
                                    >
                                        <i
                                            class="text-7xl fa-solid fa-bell"
                                        ></i>
                                        <div class="text-base font-bold">
                                            You have no notifications
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <ProgressSpinner
                                    style="width: 30px; height: 30px"
                                    class="my-3 mx-auto block"
                                    strokeWidth="3"
                                    fill="transparent"
                                />
                            </template>
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
    padding: 0.25rem 0.6rem 0;
}

.actions-item .title {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.actions-item p {
    color: var(--text-gray-color);
    font-size: 0.8rem;
}

.actions-item .icon {
    align-self: flex-start;
    background: var(--option-btn-bg);
    color: var(--icon-color);
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
    color: var(--text-color);
    font-size: 0.85rem;
    font-weight: 500;
}

.action-option:hover {
    background: var(--menu-hover-bg);
}

.header-options li {
    position: relative;
}

.option-box {
    color: var(--text-color);
    width: 345px;
    position: absolute;
    top: 100%;
    right: 1rem;
    border-radius: 0.5rem;
    z-index: 100;
    background: var(--option-bg);
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
    color: var(--text-color);
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.5rem;
    border-radius: 0.5rem;
}

.user-profile:hover {
    background: var(--items-hover-bg);
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
    color: var(--text-color);
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
    gap: 0.85rem;
    flex: 1;
}

.lookups-item:hover {
    background: var(--menu-hover-bg);
}

.lookups-item .icon {
    background: var(--option-btn-bg);
    color: var(--icon-color);
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
    font-weight: 400;
}

.lookups-item--notify .title span {
    font-weight: 700;
}

.header {
    background: var(--header-bg);
    box-shadow: 0 0 2px 2px var(--header-shadow);
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
    background: transparent;
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
    background: var(--option-btn-bg);
    color: var(--icon-color);
    aspect-ratio: 1/1;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    --p-badge-min-width: 1.1rem;
    transition: none;
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
    background: transparent;
    padding: 0;
}

body .p-tablist-tab-list {
    border: none;
    background: transparent;
}
.p-badge {
    outline: none !important;
}

.dark .p-tab {
    border-color: transparent !important;
}
.p-tab i {
    color: var(--text-gray-color);
}
.lookups-item--notify .icon {
    width: 56px;
}
</style>
