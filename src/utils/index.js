import helpers from './helpers';

const plugin = {
    install(app) {
        app.config.globalProperties.$helpers = helpers;
    }
};

export default plugin;
