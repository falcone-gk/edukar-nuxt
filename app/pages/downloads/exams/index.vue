<template>
  <section id="downloads" class="flex justify-center px-2">
    <!-- Downloads content -->
    <div class="w-full flex flex-col md:flex-row gap-8">
      <UCard class="md:min-w-72 lg:min-w-96">
        <div class="flex flex-col gap-8 px-3 py-3.5">
          <div class="flex flex-col gap-5">
            <UFormGroup label="Año:">
              <UiSelect
                class="w-full"
                v-model="filters.year"
                :options="filtersOpt?.years"
              />
            </UFormGroup>
            <UFormGroup label="Universidad:">
              <UiSelect
                class="w-full"
                v-model="filters.univ"
                :options="filtersOpt?.universities"
                option-attribute="name"
                value-attribute="siglas"
              />
            </UFormGroup>
            <UFormGroup label="Tipo de examen:">
              <UiSelect
                class="w-full"
                v-model="filters.type"
                :options="typesOpt"
                :disabled="!filters.univ"
              />
            </UFormGroup>
            <UFormGroup label="Are de examen">
              <UiSelect
                class="w-full"
                v-model="filters.area"
                :options="areasOpt"
                :disabled="!filters.univ"
              />
            </UFormGroup>
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
        <Typography class="mb-8" tag="h1" variant="h1" color="primary">
          Exámenes
        </Typography>
        <div
          class="h-[700px] overflow-y-auto border-2 border-gray-200 dark:border-gray-800 p-8 rounded-lg"
        >
          <DataLoading :loading="pending" :data="data" :list="data?.results">
            <template #loading>
              <SkeletonCardList />
            </template>

            <template #data="{ data }">
              <DisplayGrid>
                <CardResume
                  v-for="exam in data.results"
                  :image="exam.cover"
                  :title="exam.title"
                  :to="`/downloads/exams/${exam.slug}`"
                />
              </DisplayGrid>
            </template>
          </DataLoading>
        </div>
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

<script lang="ts" setup>
import type { Exam } from "~/types/resultApiTypes";
import type { ExamsFilter } from "~/types";

useSeoMeta({
  title: "Lista de Exámenes de Admisión",
  description:
    "Lista de exámenes de admisión de distintas universidades del Perú y solucionarios descargables.",
});

const videos = [
  { label: "Video Solucionario Gratis", value: "free" },
  { label: "Video Solucionario Premium", value: "premium" },
];

const nuxtApp = useNuxtApp();
const { data: filtersOpt } = await useEdukarAPI<ExamsFilter>(
  "/services/exams-filters",
  {
    key: "exams-filter",
    transform: (filters) => ({
      ...filters,
      universities: filters.universities.map((univ) => ({
        ...univ,
        name: `${univ.name} (${univ.siglas})`,
      })),
    }),
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

const typesOpt = computed(() => {
  if (!filtersOpt.value) return [];

  return filtersOpt.value.universities.find((el) => el.siglas === filters.univ)
    ?.exam_types;
});

const areasOpt = computed(() => {
  if (!filtersOpt.value) return [];

  return filtersOpt.value.universities.find((el) => el.siglas === filters.univ)
    ?.exam_areas;
});

type ExamPagination = PaginationData<Exam>;
const route = useRoute();
//TODO: check why on refresh filter.year in select is not applied
const filters = reactive({
  year: route.query.year as string | undefined,
  univ: route.query.university as string | undefined,
  type: route.query.type as string | undefined,
  area: route.query.area as string | undefined,
  // video: route.query.video as string | undefined,
});
const pageCount = ref(8);
const { getFilteredData, page, clearFilters } = usePaginationFilter({
  size: pageCount.value,
  filters: filters,
  url: "/services/exams/",
});

const { data, status } = getFilteredData<ExamPagination>({
  //TODO: key parameter is not dynamic and refresh by watch doesnt
  // care by getCachedData
  key: route.fullPath,
  lazy: true,
});
const pending = computed(() => status.value === "pending");

const router = useRouter();
const updateQueryUrl = () => {
  router.push({
    path: route.path,
    query: {
      year: filters.year,
      university: filters.univ,
      type: filters.type,
      area: filters.area,
      // video: filters.video,
    },
  });
};

watch(filters, () => {
  updateQueryUrl();
});

watch(
  () => filters.univ,
  () => {
    filters.area = undefined;
    filters.type = undefined;
  },
);
</script>
