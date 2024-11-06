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
  const initialUndefined: { [key: string]: undefined } = {};
  Object.keys(filters).forEach((filter) => {
    initialUndefined[filter] = undefined;
  });
  const myFilters = toRefs(filters);

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
      query: {
        ...myFilters,
        page: page,
        size: size,
      },
      watch: [page, filters],
      getCachedData: (key) => {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    });
  }

  watch(filters, async () => {
    if (page.value !== 1) {
      page.value = 1;
    }
  });

  const clearFilters = async () => {
    // Clear all filters and reset page to 1
    Object.assign(filters, initialUndefined);
  };

  return { page, clearFilters, getFilteredData };
};
