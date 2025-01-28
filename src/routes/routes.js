import AppLayout from '@/layout/AppLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';

export default [
    {
        path: '/',
        name: 'Home',
        component: AppLayout
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/auth/Login.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/errors/NotFound.vue')
    }
];
