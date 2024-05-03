<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">

    <template #header>
      <Typography tag="h1" variant="h1">
        Notificaciones
      </Typography>
    </template>

    <UTable :loading="pending" :rows="data?.results" v-model="selected"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Cargando...' }"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay notificaciones' }"
      :progress="{ color: 'primary', animation: 'carousel' }" class="w-full" :columns="columns">

      <template #title-data="{ row }">
        <span :class="{ ['text-primary-500 dark:text-primary-300']: !row.is_read }">{{ row.title }}</span>
      </template>

      <template #actions-data="{ row }">
        <UButton v-if="row.source_path !== ''" color="gray" label="Ver" variant="ghost"
          icon="i-heroicons-arrow-top-right-on-square-solid" size="xs" @click="onView(row.source_path, row.id)" />
      </template>
    </UTable>

    <div v-if="!pending" class="flex justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="data?.count" />
      <div class="space-x-2">
        <UButton label="Marcar como leído" color="gray" :disabled="selected.length === 0" @click="onMarkAsRead" />
        <UButton label="Eliminar" color="red" :disabled="selected.length === 0" @click="onDeleteNotifications" />
      </div>

    </div>

  </UCard>
</template>

<script lang="ts" setup>
import type { Notification } from "~/types";

const { showNotification } = useNotification()

type PaginationNotification = PaginationData<Notification>
const page = ref(1)
const pageCount = ref(5)

const columns = ref([
  { key: 'title', label: 'Título' },
  { key: 'description', label: 'Decripción' },
  { key: 'sender', label: 'Enviado por' },
  { key: 'time_difference', label: 'Fecha' },
  { key: 'actions' }
])

const selected = ref<Notification[]>([])
const selectedIds = computed(() => {
  return selected.value.map(el => el.id)
})

const { data, pending, refresh } = useAsyncData(
  'user-notifications',
  () => useApiFetch<PaginationNotification>('/notification/notification-user/', {
    query: {
      page: page.value,
      size: pageCount.value
    },
  }), {
  lazy: true,
  server: false,
  watch: [page]
})

const { execute: markAsRead } = useAsyncData(
  'user-notifications-mark-as-read',
  () => useApiFetch('/notification/notification-user/set-read/', {
    method: 'post',
    body: {
      selected_notifications: selectedIds.value
    }
  }), {
  immediate: false
})

const onView = (path: string, id: number) => {
  selected.value = data.value!.results.filter(el => el.id === id)
  markAsRead()
  navigateTo(path)
}

const onMarkAsRead = async () => {
  await markAsRead()
  await refresh()
  selected.value = []
  showNotification({ message: 'Notificaciones marcadas como leídas', type: 'success' })
}

const { execute: deleteNotifications } = useAsyncData(
  'user-notifications-delete',
  () => useApiFetch('/notification/notification-user/delete-notifications/', {
    method: 'post',
    body: {
      selected_notifications: selectedIds.value
    }
  }), {
  immediate: false
})

const onDeleteNotifications = async () => {
  await deleteNotifications()
  await refresh()
  selected.value = []
  showNotification({ message: 'Notificaciones eliminadas', type: 'success' })
}

</script>