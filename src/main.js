import App from './App.vue';
import { createApp } from 'vue';
import { registerPlugins } from '@/plugins';
export const app = createApp(App);
registerPlugins(app);

app.mount('#app');
