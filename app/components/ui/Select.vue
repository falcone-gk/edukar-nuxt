<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Object] as PropType<
      string | number | Record<string, any> | undefined
    >,
    default: "",
  },
  icon: {
    type: String,
    default: "i-heroicons-x-mark-solid",
  },
  color: {
    type: String,
    default: "gray",
  },
});

const emit = defineEmits(["update:model-value"]);
const selection = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:model-value", value);
  },
});
</script>

<template>
  <UButtonGroup>
    <USelect v-model="selection" v-bind="{ ...$attrs }" />
    <UButton
      :icon="props.icon"
      :color="props.color"
      @click="selection = undefined"
    />
  </UButtonGroup>
</template>
