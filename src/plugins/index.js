import pinia from '../stores';
import router from '../routes';
import utils from '../utils';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import '@/assets/css/styles.scss';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.scss';
import '@fortawesome/fontawesome-free/css/all.css';

import InputField from '@/components/common/InputField.vue';
import Button from 'primevue/button';
import Ripple from 'primevue/ripple';
import OverlayBadge from 'primevue/overlaybadge';
import Menu from 'primevue/menu';
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import DatePicker from 'primevue/datepicker';
import Tooltip from 'primevue/tooltip';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

export function registerPlugins(app) {
    app.use(utils);
    app.use(pinia);
    app.use(router);
    app.use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false
            }
        },
        ripple: true
    });

    app.component('Tabs', Tabs);
    app.component('OverlayBadge', OverlayBadge);
    app.component('TabList', TabList);
    app.component('Tab', Tab);
    app.component('Button', Button);
    app.component('Divider', Divider);
    app.component('Tooltip', Tooltip);
    app.component('InputField', InputField);
    app.component('Password', Password);
    app.component('InputNumber', InputNumber);
    app.component('InputText', InputText);
    app.component('Textarea', Textarea);
    app.component('Menu', Menu);
    app.component('AutoComplete', AutoComplete);
    app.component('Checkbox', Checkbox);
    app.component('RadioButton', RadioButton);
    app.component('SelectButton', SelectButton);
    app.component('DatePicker', DatePicker);
    app.component('Avatar', Avatar);
    app.component('AvatarGroup', AvatarGroup);
    app.component('IconField', IconField);
    app.component('InputIcon', InputIcon);

    app.directive('tooltip', Tooltip);
    app.directive('ripple', Ripple);
}

const directives = {
    tooltip: Tooltip
};

const components = {
    InputField,
    OverlayBadge,
    Button,
    Divider,
    Tabs,
    TabList,
    Tab,
    Menu,
    Password,
    InputNumber,
    InputText,
    Textarea,
    AutoComplete,
    Checkbox,
    RadioButton,
    SelectButton,
    DatePicker,
    Tooltip,
    Avatar,
    AvatarGroup,
    IconField,
    InputIcon
};
const plugins = [utils, pinia, router];

export { directives, components, plugins };
