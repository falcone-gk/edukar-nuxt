<template>
  <UCard class="w-full" :ui="{ background: '', ring: '', shadow: '' }">

    <template #header>
      <Typography tag="h1" variant="h1">
        Notificaciones
      </Typography>
    </template>

    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <div>
        <USelect v-model="filters.is_read" label="Sección" :options="isReadOptions"
          placeholder="--Seleccionar sección--" />
      </div>
      <div>
        <UButton label="Limpiar filtros" variant="ghost" color="gray" @click=clearFilters />
      </div>
    </div>

    <UTable :loading="pending" :rows="data?.results" v-model="selected"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Cargando...' }"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay notificaciones' }"
      :progress="{ color: 'primary', animation: 'carousel' }" class="w-full" :columns="columns">

      <template #title-data="{ row }">
        <span :class="{ ['text-primary-500 dark:text-primary-300']: !row.is_read }">{{ row.title }}</span>
      </template>

      <template #actions-data="{ row }">
        <UButton v-if="row.source_path !== ''" color="gray" label="Ver" variant="ghost"
          icon="i-heroicons-arrow-top-right-on-square-solid" size="xs" :to="row.source_path" @click="onView(row.id)" />
      </template>
    </UTable>

    <div v-if="!pending && data" class="flex justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="data.count" />
      <div class="space-x-2">
        <UButton label="Marcar como leído" color="gray" :disabled="selected.length === 0" @click="onMarkAsRead" />
        <UButton label="Eliminar" color="red" :disabled="selected.length === 0" @click="onDeleteNotifications" />
      </div>

    </div>

  </UCard>
</template>

<script lang="ts" setup>
import type { Notification } from "~/types";

const columns = ref([
  { key: 'title', label: 'Título' },
  { key: 'description', label: 'Decripción' },
  { key: 'sender', label: 'Enviado por' },
  { key: 'time_difference', label: 'Fecha' },
  { key: 'actions' }
])


type PaginationNotification = PaginationData<Notification>
const filters = reactive({
  is_read: undefined
})
const isReadOptions = reactive([
  { value: 1, label: 'Leídos' },
  { value: 0, label: 'No leídos' }
])
const pageCount = ref(5)
const { data, pending, page, clearFilters, refresh } = usePaginationFilter<PaginationNotification>(
  {
    key: 'user-notifications',
    size: pageCount.value,
    filters: filters,
    url: '/notification/notification-user/'
  }
)


const { showNotification } = useNotification()
const selected = ref<Notification[]>([])
const selectedIds = computed(() => {
  return selected.value.filter(el => !el.is_read).map(el => el.id)
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

const onView = (id: number) => {
  selected.value = data.value!.results.filter(el => el.id === id)
  const selectedNotification = selected.value[0]
  // Mark as read only if notification is not read
  if (!selectedNotification.is_read) markAsRead()
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
