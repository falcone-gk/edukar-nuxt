<template>
  <section id="downloads" class="flex justify-center px-2">
    <!-- Downloads content -->
    <UContainer
      :ui="{
        base: 'w-full max-w-[900px]',
      }"
    >
      <UCard class="flex-grow flex-shrink-0 basis-full">
        <template #header>
          <Typography tag="h1" variant="h1" color="primary">
            Exámenes
          </Typography>
        </template>

        <div>
          <div class="flex flex-col-reverse md:flex-row gap-2 px-3 py-3.5">
            <div class="flex flex-col md:flex-row gap-2">
              <UFormGroup>
                <UiSelect
                  v-model="filters.year"
                  :options="filtersOpt?.years"
                  @change="updateQueryUrl"
                  placeholder="--Seleccionar año--"
                />
              </UFormGroup>
              <UFormGroup>
                <UiSelect
                  v-model="filters.univ"
                  :options="filtersOpt?.universities"
                  option-attribute="university"
                  value-attribute="siglas"
                  @change="updateQueryUrl"
                  placeholder="--Seleccionar universidad--"
                />
              </UFormGroup>
              <UFormGroup>
                <UiSelect
                  v-model="filters.video"
                  :options="videos"
                  @change="updateQueryUrl"
                  placeholder="--Seleccionar video solucionario--"
                />
              </UFormGroup>
            </div>

            <div class="md:ml-auto">
              <UButton
                label="Limpiar filtros"
                variant="ghost"
                color="gray"
                @click="onClearFilters"
              />
            </div>
          </div>

          <DataLoading :loading="pending" :data="data" :list="data?.results">
            <template #loading>
              <SkeletonCardList />
            </template>

            <template #data="{ data }">
              <div
                class="grid gap-4 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]"
              >
                <CardResume
                  v-for="exam in data.results"
                  :image="exam.cover"
                  :title="exam.title"
                  :to="`/downloads/exams/${exam.slug}`"
                />
              </div>
            </template>
          </DataLoading>
        </div>
        <template v-if="!pending && data" #footer>
          <div class="flex justify-center">
            <UPagination
              :total="data?.count"
              :page-count="pageCount"
              v-model="page"
            />
          </div>
        </template>
      </UCard>
    </UContainer>
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
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

type ExamPagination = PaginationData<Exam>;
const route = useRoute();
//TODO: check why on refresh filter.year in select is not applied
const filters = reactive({
  year: route.query.year as string | undefined,
  univ: route.query.university as string | undefined,
  video: route.query.video as string | undefined,
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
      video: filters.video,
    },
  });
};

const onClearFilters = () => {
  clearFilters();
  updateQueryUrl();
};
</script>
