<script setup>
import { computed } from 'vue';
import { useGlobalStore } from '@/stores';

const globalStore = useGlobalStore();

const props = defineProps({
    variant: {
        type: String
    },
    id: {
        type: String
    }
});

const errors = computed(() => {
    if (props.errorMessages && Array.isArray(props.errorMessages)) {
        return props.errorMessages;
    } else if (props.errorMessages && typeof props.errorMessages == 'string') {
        return [props.errorMessages];
    } else if (globalStore.errors) {
        if (globalStore.errors[props.id]) {
            return globalStore.errors[props.id];
        } else {
            const id = props.id + '.en';
            return globalStore.errors[id];
        }
    } else {
        return [];
    }
});
</script>

<template>
    <InputText v-if="props.variant == 'text'" v-bind="$attrs" :id="props.id" />
    <Textarea
        v-else-if="props.variant == 'textarea'"
        v-bind="$attrs"
        :id="props.id"
    />
    <AutoComplete
        v-else-if="props.variant == 'autocomplete'"
        v-bind="$attrs"
        :id="props.id"
    />
    <Checkbox
        v-else-if="props.variant == 'checkbox'"
        v-bind="$attrs"
        :id="props.id"
    />
    <RadioButton
        v-else-if="props.variant == 'radio'"
        v-bind="$attrs"
        :id="props.id"
    />
    <InputNumber
        v-else-if="props.variant == 'number'"
        v-bind="$attrs"
        :id="props.id"
        :maxFractionDigits="2"
        :max="999999999999999"
    />
    <Password
        v-else-if="props.variant == 'password'"
        v-bind="$attrs"
        :id="props.id"
    />

    <SelectButton
        v-else-if="props.variant == 'selectButton'"
        v-bind="$attrs"
        :id="props.id"
    />
    <DatePicker
        v-else-if="props.variant == 'date'"
        v-bind="$attrs"
        :id="props.id"
    />

    <Message
        v-for="(error, index) in errors"
        :key="index"
        severity="error"
        variant="simple"
        size="small"
    >
        {{ error }}</Message
    >
</template>
