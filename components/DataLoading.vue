<template>
  <div>
    <!--Loading Components section-->
    <div v-if="props.loading">
      <slot name="loading" />
    </div>

    <div v-else>
      <!--Error section-->
      <div v-if="props.data === null">
        <DataError />
      </div>

      <!--Data section-->
      <div v-else>
        <div v-if="Array.isArray(props.data) && props.data.length === 0">
          <DataEmpty />
        </div>
        <div v-else>
          <slot name="data" :data="props.data"></slot>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup generic="T">
const props = defineProps<{
  loading: boolean,
  data: T | null
}>()
</script>