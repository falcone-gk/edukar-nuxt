<script lang="ts" setup>
const props = defineProps({
  label: String,
});

const counter = defineModel<number>("counter", { required: true, default: 0 });
</script>

<template>
  <UFormGroup
    :label="props.label"
    :ui="{ wrapper: 'flex gap-8 justify-between', inner: 'flex items-center' }"
  >
    <div class="flex items-center gap-2">
      <UButton
        @click="counter--"
        :disabled="counter <= 0"
        icon="i-mdi-minus"
        class="w-8 h-8 rounded-full"
      />

      <UInput
        v-model="counter"
        :model-modifiers="{ number: true }"
        class="w-12"
        v-bind="$attrs"
        readonly
      />

      <UButton
        @click="counter++"
        icon="i-mdi-plus"
        class="w-8 h-8 rounded-full"
      />
    </div>
  </UFormGroup>
</template>
