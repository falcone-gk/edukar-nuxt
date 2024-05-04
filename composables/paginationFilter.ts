interface PaginationFilter {
  filters: { [key: string]: string | number | boolean | undefined }
}

export const usePaginationFilter = ({ filters }: PaginationFilter) => {
  const page = ref(1)
  const userFilters = reactive(filters)
  const refresh = ref(async () => Promise<any>)

  const setRefresh = (refreshCallback: () => Promise<any>) => {
    refresh.value = refreshCallback
  }

  const initialUndefined: { [key: string]: undefined } = {}
  Object.keys(filters).forEach(filter => {
    initialUndefined[filter] = undefined
  })

  watch(userFilters, async () => {
    if (page.value !== 1) {
      page.value = 1
    } else {
      await refresh.value()
    }
  })

  const clearFilters = async () => {
    // Clear all filters and reset page to 1
    Object.assign(userFilters, initialUndefined)
  }

  return { page, clearFilters, setRefresh }

}
