<script setup>
import Placeholder from '@/assets/images/placeholder-user.png';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const user = {
    full_name: 'Arham Khan',
    username: 'arhamkhan'
};
const items = ref([
    {
        label: 'Arham Khan',
        image: Placeholder,
        to: {
            name: 'user-detail',
            params: { username: user.username }
        }
    },
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
]);
const isActive = (to) => {
    return (
        route.name === to.name &&
        JSON.stringify(route.params) === JSON.stringify(to.params)
    );
};
</script>
<template>
    <Menu :model="items" class="bg-transparent border-none">
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
                        :src="Placeholder"
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
.p-menu-item-link .icon {
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
    color: var(--primary-color);
    background: var(--primary-light-color);
}
</style>
