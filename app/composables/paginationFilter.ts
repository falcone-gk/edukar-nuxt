interface PaginationFilter {
  key: string
  size: number
  filters: { [key: string]: string | number | boolean | undefined }
  url: string
}

export const usePaginationFilter = <T>({ key, size, filters, url }: PaginationFilter) => {
  const page = ref(1)
  const initialUndefined: { [key: string]: undefined } = {}
  Object.keys(filters).forEach(filter => {
    initialUndefined[filter] = undefined
  })
  const myFilters = toRefs(filters)

  const { data, pending, refresh } = useEdukarAPI<T>(url, {
    query: {
      ...myFilters,
      page: page,
      size: size
    },
    lazy: true,
    server: false,
    watch: [page]
  })
  /* const { data, pending, refresh } = useAsyncData(
    key,
    () => useApiFetch<T>(url, {
      query: {
        ...filters,
        page: page.value,
        size: size
      }
    }),
    {
      lazy: true,
      server: false,
      watch: [page]
    }
  ) */

  watch(filters, async () => {
    if (page.value !== 1) {
      page.value = 1
    } else {
      await refresh()
    }
  })

  const clearFilters = async () => {
    // Clear all filters and reset page to 1
    Object.assign(filters, initialUndefined)
  }

  return { data, pending, page, clearFilters, refresh }

}
