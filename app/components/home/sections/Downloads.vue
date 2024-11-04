<template>
  <div class="flex flex-col justify-center items-center gap-8">
    <p class="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl">
      Entra a nuestra galería de exámenes de admisión de las diferentes
      universidades donde podrás descargarlos y practicar lo aprendido.
    </p>
    <UCarousel
      v-if="exams"
      class="w-[256px] md:w-[512px] lg:w-[768px] rounded-lg overflow-hidden"
      arrows
      v-slot="{ item }"
      :items="exams"
      :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3' }"
    >
      <CardResume
        :image="item.cover"
        :title="item.title"
        class="w-full"
        :to="`/downloads/exams/${item.slug}`"
      />
    </UCarousel>
    <CustomButtonGradient
      to="/downloads/exams"
      size="xl"
      label="Ver exámenes"
      icon="i-heroicons-book-open-solid"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Exam } from "~/types/resultApiTypes";

type ExamPagination = PaginationData<Exam>;

const nuxtApp = useNuxtApp();
const { data: exams } = await useEdukarAPI<Exam[]>("/services/exams/", {
  key: "home-exams",
  query: {
    size: 4,
  },
  lazy: true,
  // @ts-ignore
  transform: (data: ExamPagination): Exam[] => {
    const _exams = data.results as Exam[];
    return _exams;
  },
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
});

/* const { data: exams } = await useLazyAsyncData(
  'exams-home-page', () => useApiFetch<ExamPagination>('/services/exams/', {
    query: {
      size: 4
    }
  }), {
  transform: (data: ExamPagination) => {
    const _exams = data.results
    return _exams
  }
}) */

const onClick = (year: number, siglas: string) => {
  navigateTo(`/downloads/exams?year=${year}&university=${siglas}`);
};
</script>
