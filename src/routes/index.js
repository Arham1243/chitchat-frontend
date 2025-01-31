import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
// import { useSessionStore } from '@/stores';

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach(async (to, from, next) => {
    // const sessionStore = useSessionStore();
    // const { access_token: accessToken } = sessionStore.getCookie() || {};
    // const accessToken = 'test';
    const accessToken = undefined;

    const isAuth = to.path.startsWith('/auth');

    if (!accessToken) {
        if (isAuth) {
            next();
        } else {
            next({ name: 'login' });
        }
    } else if (accessToken && !isAuth) {
        next();
    } else {
        next({ name: 'home' });
    }
});

export default router;
