import pinia from '../stores';
import router from '../routes';
import utils from '../utils';

import '@/assets/css/styles.scss';

export function registerPlugins(app) {
    app.use(utils);
    app.use(pinia);
    app.use(router);
}

const plugins = [utils, pinia, router];

export { plugins };
