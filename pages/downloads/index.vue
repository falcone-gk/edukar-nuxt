<template>
  <section id="downloads" class="flex justify-center px-2">
    <LazyUModal v-model="isOpen" prevent-close :ui="{
      width: 'w-11/12 sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-2/5'
    }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-start justify-between">
            <h3 class="text-base font-semibold leading-6 text-primary">
              {{ examSelectData?.title }}
            </h3>
            <UButton variant="ghost" icon="i-heroicons-x-mark-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <!-- Card Body -->
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <div class="mx-auto sm:w-1/2">
            <img :src="useImgFullPath(examSelectData?.cover as string)" alt="Book cover" class="w-full max-w-[400px]">
          </div>
          <div class="sm:w-1/2 pl-4">
            <div class="flex flex-col my-3 gap-2">
              <p>
                <strong class="text-primary">Universidad:</strong> {{ examSelectData?.root.university }}
              </p>
              <p>
                <strong class="text-primary">Tipo de examen:</strong> {{ examSelectData?.root.exam_type }}
              </p>
              <p>
                <strong class="text-primary">Area:</strong> {{ examSelectData?.root.area }}
              </p>
              <p>
                <strong class="text-primary">Año:</strong> {{ examSelectData?.year }}
              </p>
            </div>
            <div class="flex flex-wrap justify-start gap-2">
              <UButton label="Descargar" size="xs" variant="soft" rounded :to="examSelectData?.source_exam" target="_blank"
              :ui="customUIBtn" />

              <UButton v-if="examSelectData?.source_video_solution" label="Video solucionario" size="xs" variant="soft"
                rounded :to="examSelectData?.source_exam" target="_blank" :ui="customUIBtn">
                <template #trailing>
                  <span class="text-black px-1.5 py-0.5 rounded bg-gray-300">Free</span>
                </template>
              </UButton>

              <UButton v-if="examSelectData?.source_video_solution_premium" label="Video solucionario" size="xs"
                variant="soft" rounded :to="examSelectData?.source_exam" target="_blank" :ui="customUIBtn">
                <template #trailing>
                  <span class="flex gap-1 text-black px-1.5 py-0.5 rounded bg-yellow-400">
                    <img class="w-4 h-auto" src="/icons/crown.svg" alt="crown">
                    Premium
                  </span>
                </template>
              </UButton>
            </div>
          </div>
        </div>

      </UCard>
    </LazyUModal>
    <UContainer>
      <UCard>
        <template #header>
          <h1 class="title-section">Exámenes</h1>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <CardResume v-for="exam in data?.results" :image="exam.cover" :title="exam.title"
            @callback="showSelectedExam(exam)" />
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UPagination :total="data?.count" :page-count="pageCount" v-model="page" />
          </div>
        </template>
      </UCard>
    </UContainer>
  </section>
</template>

<script lang="ts" setup>
import type { Exams } from '~/types/resultApiTypes';

type ExamPagination = PaginationData<Exams>

const page = ref(1)
const pageCount = ref(8)
const isOpen = ref(false)
const { data } = await useAsyncData<ExamPagination>(
  'exams',
  () => useApiFetch<ExamPagination>('/services/exams-list', {
    query: {
      page: page.value,
      size: pageCount.value
    }
  }),
  { watch: [page,] }
)

const customUIBtn = {rounded: 'rounded-full'}

const examSelectData = ref<Exams | undefined>(undefined)
const showSelectedExam = (examData: Exams) => {
  examSelectData.value = examData
  isOpen.value = true
}
</script>