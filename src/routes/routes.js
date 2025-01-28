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
                name: 'login',
                component: () => import('@/views/auth/Login.vue')
            },
            {
                path: 'signup',
                name: 'signup',
                component: () => import('@/views/auth/Signup.vue')
            },
            {
                path: 'password/forget',
                name: 'forget-password',
                component: () => import('@/views/auth/ForgetPassword.vue')
            },
            {
                path: 'password/reset',
                name: 'reset-password',
                component: () => import('@/views/auth/ResetPassword.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/errors/NotFound.vue')
    }
];
