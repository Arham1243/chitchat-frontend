<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores';
const authStore = useAuthStore();
const route = useRoute();
const user = computed(() => authStore.currentUser);

const items = computed(() => {
    const userItem = user.value
        ? {
              label: user.value.name,
              image: user.value.profile_picture,
              to: {
                  name: 'user-detail',
                  params: { username: user.value.username || 'username' }
              }
          }
        : null;

    return [
        userItem,
        {
            label: 'Find friends',
            icon: 'icon fa-solid fa-users',
            to: { name: 'friends' }
        },
        {
            label: 'Your friends',
            icon: 'icon fa-solid fa-user-group',
            to: { name: 'my-friends' }
        }
    ].filter((item) => item);
});

const isActive = (to) => {
    if (!route.params) {
        return route.name === to.name;
    }
    return (
        route.name === to.name &&
        Object.keys(route.params).every(
            (key) => route.params[key] === to.params[key]
        )
    );
};
</script>
<template>
    <Menu :model="items" class="bg-transparent border-none mb-hidden">
        <template #item="{ item, props }">
            <router-link v-slot="{ href, navigate }" :to="item.to" custom>
                <a
                    v-ripple
                    :href="href"
                    v-bind="props.action"
                    @click="navigate"
                    :class="['menu-item', { active: isActive(item.to) }]"
                >
                    <span v-if="item.icon" :class="item.icon" />
                    <img
                        v-else-if="item.image"
                        :src="item.image"
                        :alt="item.label"
                    />
                    <span class="ml-2 label">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
    </Menu>
</template>
<style>
.p-menu-item-link {
    padding: 0.5rem 1rem !important;
}
.menu-item {
    --icon-width: 26px;
}
.p-menu-item-content {
    background: transparent !important;
}
.p-menu-item {
    border-radius: 0.5rem;
    overflow: hidden;
}
.p-menu-item * {
    color: var(--text-color);
}
.p-menu-item-link .icon {
    color: var(--text-gray-color);
    width: var(--icon-width);
    aspect-ratio: 1/1;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.menu-item .label {
    font-size: 0.9rem;
}
.menu-item img {
    width: var(--icon-width);
    aspect-ratio: 1/1;
    border-radius: 100%;
    object-fit: cover;
}
.menu-item.active {
    background: var(--primary-light-color);
}
.menu-item.active * {
    color: var(--primary-color);
}
</style>
