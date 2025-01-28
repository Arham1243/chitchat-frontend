<script setup>
// import { computed } from 'vue';
// import { useGlobalStore } from '@/stores';

// const globalStore = useGlobalStore();

const props = defineProps({
    variant: {
        type: String
    }
});

// const errors = computed(() => {
//     if (props.errorMessages && Array.isArray(props.errorMessages)) {
//         return props.errorMessages;
//     } else if (props.errorMessages && typeof props.errorMessages == 'string') {
//         return [props.errorMessages];
//     } else if (globalStore.errors) {
//         if (globalStore.errors[props.id]) {
//             return globalStore.errors[props.id];
//         } else {
//             const id = props.id + '.en';
//             return globalStore.errors[id];
//         }
//     } else {
//         return [];
//     }
// });
</script>

<template>
    <InputText v-if="props.variant == 'text'" v-bind="$attrs" />
    <Textarea v-else-if="props.variant == 'textarea'" v-bind="$attrs" />
    <AutoComplete v-else-if="props.variant == 'autocomplete'" v-bind="$attrs" />
    <Checkbox v-else-if="props.variant == 'checkbox'" v-bind="$attrs" />
    <RadioButton v-else-if="props.variant == 'radio'" v-bind="$attrs" />
    <InputNumber
        v-else-if="props.variant == 'number'"
        v-bind="$attrs"
        :maxFractionDigits="2"
        :max="999999999999999"
    />
    <Password v-else-if="props.variant == 'password'" v-bind="$attrs" />
    <MultiSelect v-else-if="props.variant == 'multiselect'" v-bind="$attrs" />

    <SelectButton v-else-if="props.variant == 'selectButton'" v-bind="$attrs" />
    <DatePicker v-else-if="props.variant == 'date'" v-bind="$attrs" />

    <!-- <small
        v-for="(error, index) in errors"
        :key="index"
        class="p-error block"
        :class="{ 'mb-2': index == errors.length - 1 }"
        id="text-error"
        data-testid="validation-error"
    >
        {{ error }}
    </small> -->
</template>
