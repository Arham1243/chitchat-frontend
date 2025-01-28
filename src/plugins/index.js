import pinia from '../stores';
import router from '../routes';
import utils from '../utils';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import '@/assets/css/styles.scss';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.scss';

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
import { definePreset } from '@primevue/themes';

const stylePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
        colorScheme: {
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{neutral.50}',
                    100: '{neutral.100}',
                    200: '{neutral.200}',
                    300: '{neutral.300}',
                    400: '{neutral.400}',
                    500: '{neutral.500}',
                    600: '{neutral.600}',
                    700: '{neutral.700}',
                    800: '{neutral.800}',
                    900: '{neutral.900}',
                    950: '{neutral.950}'
                }
            }
        }
    }
});

export function registerPlugins(app) {
    app.use(utils);
    app.use(pinia);
    app.use(router);
    app.use(PrimeVue, {
        theme: {
            preset: stylePreset,
            options: {
                darkModeSelector: false
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
