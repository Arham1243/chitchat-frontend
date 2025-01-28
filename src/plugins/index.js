import pinia from '../stores';
import router from '../routes';
import utils from '../utils';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import '@/assets/css/styles.scss';
import 'primeicons/primeicons.css';

import InputField from '@/components/common/InputField.vue';
import Button from 'primevue/button';
import Password from 'primevue/password';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import MultiSelect from 'primevue/multiselect';
import SelectButton from 'primevue/selectbutton';
import DatePicker from 'primevue/datepicker';
import Tooltip from 'primevue/tooltip';

export function registerPlugins(app) {
    app.use(utils);
    app.use(pinia);
    app.use(router);
    app.use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false || 'none'
            }
        }
    });

    app.component('Button', Button);
    app.component('Tooltip', Tooltip);
    app.component('InputField', InputField);
    app.component('Password', Password);
    app.component('InputNumber', InputNumber);
    app.component('InputText', InputText);
    app.component('Textarea', Textarea);
    app.component('AutoComplete', AutoComplete);
    app.component('Checkbox', Checkbox);
    app.component('RadioButton', RadioButton);
    app.component('MultiSelect', MultiSelect);
    app.component('SelectButton', SelectButton);
    app.component('DatePicker', DatePicker);

    app.directive('tooltip', Tooltip);
}

const directives = {
    tooltip: Tooltip
};

const components = {
    InputField,
    Button,
    Password,
    InputNumber,
    InputText,
    Textarea,
    AutoComplete,
    Checkbox,
    RadioButton,
    MultiSelect,
    SelectButton,
    DatePicker,
    Tooltip
};
const plugins = [utils, pinia, router];

export { directives, components, plugins };
