<template>
  <div>
    <!--Loading Components section-->
    <div v-if="props.loading">
      <slot name="loading">
        <DataLoadingTransition :message="props.loadingMessage" />
      </slot>
    </div>

    <div v-else>
      <!--Error section-->
      <div v-if="props.data === null">
        <DataError />
      </div>

      <!--Data section-->
      <div v-else>
        <div v-if="(Array.isArray(props.data) && props.data.length === 0) || (props.list && props.list.length === 0)">
          <DataEmpty :message="props.emptyMessage" />
        </div>
        <div v-else>
          <slot name="data" :data="props.data"></slot>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup generic="T, E">
const props = defineProps<{
  loading?: boolean,
  data: T | null,
  list?: E[] | null,
  emptyMessage?: string
  loadingMessage?: string
}>()
</script>
