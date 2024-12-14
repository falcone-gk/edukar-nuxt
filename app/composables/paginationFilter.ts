import type { UseFetchOptions } from "nuxt/app";

type SerializedType = string | number | boolean | undefined;
type FilterType = Record<string, SerializedType>;

interface PaginationFilter {
  size: number;
  filters: FilterType;
  url: string;
  cached?: boolean;
}

export const usePaginationFilter = <T>({
  size,
  filters,
  url,
}: PaginationFilter) => {
  const nuxtApp = useNuxtApp();
  const page = ref(1);

  // const filterKey = computed(() => {
  //   return Object.entries(myFilters)
  //     .filter(([, val]) => val.value !== undefined && val.value !== null) // Filter out undefined or null values
  //     .map(([key, val]) => `${key}=${val.value}`)
  //     .join("?");
  // });

  function getFilteredData<T>(options?: UseFetchOptions<T>) {
    return useEdukarAPI<T>(url, {
      ...options,
      //TODO: Find a solution for dynamic key
      // key: filterKey.value,
      query: filters,
      params: {
        page: page,
        size: size,
      },
      watch: [page, filters],
      getCachedData: (key) => {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    });
  }

  // Reset the page to 1 whenever filters change
  watch(filters, () => {
    if (page.value !== 1) {
      page.value = 1;
    }
  });

  const clearFilters = () => {
    // Reset all filters and page
    Object.keys(filters).forEach((key) => {
      filters[key] = undefined;
    });
    page.value = 1;
  };

  return { page, clearFilters, getFilteredData };
};
