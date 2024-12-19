<script lang="ts" setup>
import type { Product, Category, Attribute } from "~/types/store";

const nuxtApp = useNuxtApp();
const { data: filtersOpt } = await useEdukarAPI<Category[]>(
  "/store/category/filters",
  {
    key: "category-filters",
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

const router = useRouter();
const route = useRoute();

const filters = reactive<Record<string, string | undefined>>({
  category: route.query.category as string, // Initial category
});

const selectedCategoryAttributes = ref<Attribute[]>([]);

// Sync filters with URL query parameters
const syncFiltersToQuery = () => {
  const query = { ...route.query };

  // Update query parameters with current filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query[key] = value.toString();
    } else {
      delete query[key]; // Remove undefined filters from query
    }
  });

  // Push updated query to the router
  router.push({ query });
};

// Watch for changes in the category to update filters and attributes
watch(
  () => filters.category,
  (newCategoryId) => {
    const selectedCategory = filtersOpt.value?.find(
      (category) => category.id === parseInt(newCategoryId as string),
    );

    if (selectedCategory) {
      selectedCategoryAttributes.value = selectedCategory.attributes;

      // Reset attribute filters when category changes
      for (const attribute of selectedCategory.attributes) {
        delete filters[attribute.label];
      }
    } else {
      selectedCategoryAttributes.value = [];
    }
  },
  { immediate: true },
);

// Watch individual filter changes to sync with query params
watch(filters, syncFiltersToQuery, { deep: true });

const pageCount = ref(8);
const { getFilteredData, page, clearFilters } = usePaginationFilter({
  size: pageCount.value,
  filters: filters,
  url: "/store/products/",
});

type ProductPagination = PaginationData<Product>;
const { data, status } = getFilteredData<ProductPagination>({
  key: route.fullPath,
  lazy: true,
  transform: (productsPag) => {
    return {
      ...productsPag,
      results: productsPag.results.filter((prod) => prod.show),
    };
  },
});
const pending = computed(() => status.value === "pending");

// Restore filters from URL query on component mount
onMounted(() => {
  for (const [key, value] of Object.entries(route.query)) {
    filters[key] = value as string;
  }
});
</script>

<template>
  <section id="store" class="flex justify-center px-2">
    <!-- Downloads content -->
    <div class="w-full flex flex-col md:flex-row gap-8">
      <UCard class="md:min-w-72 lg:min-w-96">
        <template #header>
          <Typography tag="h2" variant="h3" color="gray"> Filtros </Typography>
        </template>

        <div class="flex flex-col gap-8 px-3 py-3.5">
          <div class="flex flex-col gap-5">
            <UFormGroup label="Categoria:">
              <UiSelect
                class="w-full"
                v-model="filters.category"
                :options="filtersOpt"
                option-attribute="name"
                value-attribute="id"
              />
            </UFormGroup>
            <div
              v-for="attribute in selectedCategoryAttributes"
              :key="attribute.id"
              class="mt-4"
            >
              <UFormGroup :label="attribute.name + ':'">
                <UiSelect
                  class="w-full"
                  v-model="filters[attribute.label]"
                  :options="attribute.options"
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormGroup>
            </div>
          </div>

          <div>
            <UButton
              label="Limpiar filtros"
              color="gray"
              @click="clearFilters"
            />
          </div>
        </div>
      </UCard>

      <div class="w-full">
        <Typography class="mb-8" tag="h1" variant="h1" color="gray">
          Tienda
        </Typography>
        <DataLoading :loading="pending" :data="data" :list="data?.results">
          <template #loading>
            <div class="flex flex-col gap-8">
              <div
                v-for="i in 3"
                :key="i"
                class="bg-gray-200 p-6 rounded-lg animate-pulse dark:bg-gray-800"
              >
                <div class="flex gap-6">
                  <div
                    class="w-48 h-48 bg-gray-100 rounded-lg dark:bg-gray-700"
                  ></div>
                  <div class="flex-1 space-y-4">
                    <div
                      class="h-4 bg-gray-100 rounded w-3/4 dark:bg-gray-700"
                    ></div>
                    <div
                      class="h-4 bg-gray-100 rounded w-1/4 dark:bg-gray-700"
                    ></div>
                    <div
                      class="h-4 bg-gray-100 rounded w-1/2 dark:bg-gray-700"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #data="{ data }">
            <div class="flex flex-col gap-8">
              <StoreProductHorizontalCard
                v-for="product in data.results"
                :product="product"
                :to="`/store/${product.slug}`"
              />
            </div>
          </template>
        </DataLoading>
        <div v-if="!pending && data">
          <div class="flex justify-center mt-8">
            <UPagination
              :total="data?.count"
              :page-count="pageCount"
              v-model="page"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
