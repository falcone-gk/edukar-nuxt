<template>
  <div class="flex flex-col justify-center items-center gap-8">
    <p class="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl">Entra a nuestra galería de exámenes de admisión de
      las diferentes universidades donde podrás descargarlos y practicar lo aprendido.
    </p>
    <UCarousel v-if="exams" class="w-[256px] md:w-[512px] lg:w-[768px] rounded-lg overflow-hidden" arrows
      v-slot="{ item }" :items="exams" :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3' }">
      <CardResume :image="item.cover" :title="item.title" class="w-full"
        @callback="onClick(item.year, item.root.siglas)" />
    </UCarousel>
    <UButton to="/downloads" size="xl">Ir a descargar</UButton>
  </div>
</template>

<script lang="ts" setup>
import type { Exams } from '~/types/resultApiTypes'

type ExamPagination = PaginationData<Exams>

const { data: exams } = await useLazyAsyncData(
  'exams-home-page', () => useApiFetch<ExamPagination>('/services/exams-list', {
    query: {
      size: 4
    }
  }), {
  transform: (data: ExamPagination) => {
    const _exams = data.results
    return _exams
  }
})

const onClick = (year: number, siglas: string) => {
  navigateTo(`/downloads?year=${year}&university=${siglas}`)
}
</script>
