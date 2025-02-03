<script setup lang="ts">
const emit = defineEmits(["close"]);
function onClose() {
  emit("close");
}
</script>

<template>
  <UModal>
    <UCard :ui="{ header: { padding: 'p-2' } }">
      <template #header>
        <div class="flex items-center justify-end">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="onClose"
          />
        </div>
      </template>
      <div>
        <img
          src="/images/store_presentation.webp"
          alt="Presentacion de tienda"
        />
      </div>
    </UCard>
  </UModal>
</template>
